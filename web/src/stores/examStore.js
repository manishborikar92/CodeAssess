import { createStore } from "zustand/vanilla";

import {
  getExamTimerState,
  registerIntegrityViolation,
} from "../lib/session/examSession.mjs";
import {
  clampQuestionIndex,
} from "../lib/workspace/navigation.mjs";
import {
  getOrderedQuestionSubset,
} from "../lib/assessment/assessmentConfig.mjs";
import { upsertBestSubmission } from "../lib/session/submissionState.mjs";
import { createExamSessionAttempt } from "../lib/use-cases/createExamSessionAttempt.js";
import { createPersistScheduler } from "./internal/createPersistScheduler.js";

function isFinalStatus(status) {
  return (
    status === "completed" ||
    status === "time-limit" ||
    status === "integrity-limit"
  );
}

function buildExamSummary(questionIds, questionsById, submissionsByQuestionId) {
  return questionIds.reduce(
    (summary, questionId) => {
      const question = questionsById.get(questionId);
      const submission = submissionsByQuestionId[questionId];

      if (question) {
        summary.maxScore += question.maxScore || 0;
      }

      if (submission) {
        summary.totalScore += submission.score || 0;
        summary.totalPassed += submission.passed || 0;
        summary.totalCases += submission.total || 0;
        summary.submittedCount += 1;
      }

      return summary;
    },
    {
      totalScore: 0,
      maxScore: 0,
      totalPassed: 0,
      totalCases: 0,
      submittedCount: 0,
    }
  );
}

export function createExamStore({
  questions,
  blueprint,
  sessionRepository,
}) {
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  const store = createStore((set, get) => {
    const persistRecord = async (record) => {
      return sessionRepository.save({
        ...record,
        lifecycle: {
          ...record.lifecycle,
          lastSavedAt: record.lifecycle.lastSavedAt || new Date().toISOString(),
        },
      });
    };

    const scheduler = createPersistScheduler({
      get,
      set,
      persistRecord,
      selectRecord: (state) => state.activeSession,
      mergePersistedRecord: (state, persisted) => ({
        ...state,
        activeSession: persisted,
      }),
    });

    return {
      questions,
      questionsById,
      blueprint,
      hydrationStatus: "idle",
      latestActiveSession: null,
      activeSession: null,
      selectedQuestions: [],

      async loadLatestActiveSession() {
        const latestActiveSession = await sessionRepository.getLatestActive();
        set((state) => ({
          ...state,
          latestActiveSession,
        }));
        return latestActiveSession;
      },

      async startDirectSession(createdAt = new Date().toISOString()) {
        const { selectedQuestions, session } = await createExamSessionAttempt({
          blueprint,
          createdAt,
          entry: {
            type: "direct",
            joinToken: null,
            invitationId: null,
          },
          questions,
          sessionRepository,
        });

        const summary = buildExamSummary(
          session.assessment.questionIds,
          questionsById,
          session.workspace.submissionsByQuestionId
        );
        const nextSession = {
          ...session,
          summary,
        };
        const persistedSession = await sessionRepository.save(nextSession);

        set((state) => ({
          ...state,
          hydrationStatus: "ready",
          activeSession: persistedSession,
          latestActiveSession: persistedSession,
          selectedQuestions,
        }));

        return persistedSession;
      },

      async hydrateSession(sessionId) {
        set((state) => ({
          ...state,
          hydrationStatus: "loading",
        }));

        const session = await sessionRepository.getById(sessionId);

        if (!session) {
          set((state) => ({
            ...state,
            hydrationStatus: "missing",
            activeSession: null,
            selectedQuestions: [],
          }));
          return null;
        }

        const selectedQuestions = getOrderedQuestionSubset(
          questions,
          session.assessment.questionIds
        );
        const nextSession = {
          ...session,
          summary: buildExamSummary(
            session.assessment.questionIds,
            questionsById,
            session.workspace.submissionsByQuestionId
          ),
        };

        set((state) => ({
          ...state,
          hydrationStatus: "ready",
          activeSession: nextSession,
          selectedQuestions,
          latestActiveSession: isFinalStatus(nextSession.lifecycle.status)
            ? state.latestActiveSession
            : nextSession,
        }));

        return nextSession;
      },

      async setCurrentQuestionIndex(index, savedAt = new Date().toISOString()) {
        const activeSession = get().activeSession;
        if (!activeSession || isFinalStatus(activeSession.lifecycle.status)) {
          return null;
        }

        const nextIndex = clampQuestionIndex(
          index,
          activeSession.assessment.questionIds.length
        );

        if (nextIndex === null) {
          return activeSession;
        }

        set((state) => ({
          ...state,
          activeSession: {
            ...state.activeSession,
            navigation: {
              currentQuestionIndex: nextIndex,
            },
            lifecycle: {
              ...state.activeSession.lifecycle,
              lastSavedAt: savedAt,
            },
          },
        }));

        await scheduler.schedulePersistence();
        return get().activeSession;
      },

      async saveDraft(questionId, code, updatedAt = new Date().toISOString()) {
        const activeSession = get().activeSession;
        if (!activeSession || isFinalStatus(activeSession.lifecycle.status)) {
          return null;
        }

        set((state) => ({
          ...state,
          activeSession: {
            ...state.activeSession,
            workspace: {
              ...state.activeSession.workspace,
              draftsByQuestionId: {
                ...state.activeSession.workspace.draftsByQuestionId,
                [questionId]: {
                  code,
                  language: state.activeSession.assessment.language,
                  updatedAt,
                },
              },
            },
            lifecycle: {
              ...state.activeSession.lifecycle,
              lastSavedAt: updatedAt,
            },
          },
        }));

        await scheduler.schedulePersistence();
        return get().activeSession;
      },

      async recordSubmission(
        questionId,
        code,
        result,
        submittedAt = new Date().toISOString()
      ) {
        const activeSession = get().activeSession;
        if (!activeSession || isFinalStatus(activeSession.lifecycle.status)) {
          return null;
        }

        const submissionsByQuestionId = upsertBestSubmission(
          activeSession.workspace.submissionsByQuestionId,
          {
            questionId,
            code,
            result,
          },
          submittedAt
        );

        const nextSession = {
          ...activeSession,
          workspace: {
            ...activeSession.workspace,
            submissionsByQuestionId,
          },
          lifecycle: {
            ...activeSession.lifecycle,
            lastSavedAt: submittedAt,
          },
        };
        nextSession.summary = buildExamSummary(
          nextSession.assessment.questionIds,
          questionsById,
          nextSession.workspace.submissionsByQuestionId
        );

        const persisted = await sessionRepository.save(nextSession);
        set((state) => ({
          ...state,
          activeSession: persisted,
        }));

        return persisted;
      },

      async recordIntegrityViolation(type, occurredAt = Date.now()) {
        const activeSession = get().activeSession;
        if (!activeSession || isFinalStatus(activeSession.lifecycle.status)) {
          return {
            violations: activeSession?.integrity.violations || [],
            shouldTerminate: false,
          };
        }

        const outcome = registerIntegrityViolation(
          activeSession.integrity.violations,
          type,
          occurredAt,
          activeSession.policy.maxViolations
        );

        const nextSession = {
          ...activeSession,
          integrity: {
            violations: outcome.violations,
          },
          lifecycle: {
            ...activeSession.lifecycle,
            lastSavedAt: new Date(occurredAt).toISOString(),
          },
        };

        const persisted = await sessionRepository.save(nextSession);
        set((state) => ({
          ...state,
          activeSession: persisted,
        }));

        return outcome;
      },

      async completeSession(
        reason = "completed",
        finishedAt = new Date().toISOString()
      ) {
        const activeSession = get().activeSession;
        if (!activeSession) {
          return null;
        }

        await scheduler.flushPendingPersistence();
        const completedSession = await sessionRepository.complete(
          activeSession.id,
          reason,
          finishedAt
        );

        set((state) => ({
          ...state,
          activeSession: completedSession,
          latestActiveSession: isFinalStatus(reason)
            ? null
            : state.latestActiveSession,
        }));

        return completedSession;
      },

      getTimerState(now = Date.now()) {
        return getExamTimerState(get().activeSession, now);
      },

      flushPendingPersistence: scheduler.flushPendingPersistence,
    };
  });

  return store;
}
