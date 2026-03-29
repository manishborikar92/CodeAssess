import { createStore } from "zustand/vanilla";

import {
  buildPracticeSummary,
  normalizePracticeWorkspaceRecord,
  PRACTICE_SESSION_VERSION,
} from "../lib/session/practiceSession.mjs";
import { upsertBestSubmission } from "../lib/session/submissionState.mjs";
import { createPersistScheduler } from "./internal/createPersistScheduler.js";

function createEmptyWorkspace(questions, now = new Date().toISOString()) {
  return {
    id: "default",
    schemaVersion: PRACTICE_SESSION_VERSION,
    mode: "practice",
    lifecycle: {
      createdAt: now,
      lastOpenedAt: now,
      lastSavedAt: now,
    },
    navigation: {
      currentQuestionId: null,
    },
    workspace: {
      draftsByQuestionId: {},
      submissionsByQuestionId: {},
    },
    summary: {
      totalScore: 0,
      maxScore: questions.reduce(
        (sum, question) => sum + (question.maxScore || 0),
        0
      ),
      attemptedCount: 0,
      solvedCount: 0,
      draftCount: 0,
    },
  };
}

function mapPracticeSummary(summary) {
  return {
    totalScore: summary.totalScore,
    maxScore: summary.maxPossibleScore,
    attemptedCount: summary.attempted,
    solvedCount: summary.solved,
    draftCount: summary.draftCount,
  };
}

export function createPracticeStore({
  questions,
  workspaceRepository,
}) {
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  const store = createStore((set, get) => {
    const persistRecord = async (workspace) => workspaceRepository.save(workspace);
    const scheduler = createPersistScheduler({
      get,
      set,
      persistRecord,
      selectRecord: (state) => state.workspace,
      mergePersistedRecord: (state, persisted) => ({
        ...state,
        workspace: persisted,
      }),
    });

    const withSummary = (workspace) => ({
      ...workspace,
      summary: mapPracticeSummary(
        buildPracticeSummary({
          questions,
          drafts: workspace.workspace.draftsByQuestionId,
          submissions: workspace.workspace.submissionsByQuestionId,
        })
      ),
    });

    return {
      questions,
      questionsById,
      hydrationStatus: "idle",
      workspace: null,

      async hydrateWorkspace(now = new Date().toISOString()) {
        const savedWorkspace = await workspaceRepository.get();
        const baseWorkspace = savedWorkspace
          ? normalizePracticeWorkspaceRecord(savedWorkspace, now)
          : createEmptyWorkspace(questions, now);
        const workspace = withSummary(baseWorkspace);

        set((state) => ({
          ...state,
          hydrationStatus: "ready",
          workspace,
        }));

        return workspace;
      },

      async openQuestion(questionId, now = new Date().toISOString()) {
        const workspace = get().workspace || createEmptyWorkspace(questions, now);

        const nextWorkspace = withSummary({
          ...workspace,
          navigation: {
            currentQuestionId: questionId,
          },
          lifecycle: {
            ...workspace.lifecycle,
            lastOpenedAt: now,
            lastSavedAt: now,
          },
        });

        set((state) => ({
          ...state,
          workspace: nextWorkspace,
          hydrationStatus: "ready",
        }));

        await scheduler.schedulePersistence();
        return get().workspace;
      },

      async saveDraft(questionId, code, updatedAt = new Date().toISOString()) {
        const workspace = get().workspace;
        if (!workspace) {
          return null;
        }

        const nextWorkspace = withSummary({
          ...workspace,
          workspace: {
            ...workspace.workspace,
            draftsByQuestionId: {
              ...workspace.workspace.draftsByQuestionId,
              [questionId]: {
                code,
                language: "python",
                updatedAt,
              },
            },
          },
          lifecycle: {
            ...workspace.lifecycle,
            lastSavedAt: updatedAt,
          },
        });

        set((state) => ({
          ...state,
          workspace: nextWorkspace,
        }));

        await scheduler.schedulePersistence();
        return get().workspace;
      },

      async recordSubmission(
        questionId,
        code,
        result,
        submittedAt = new Date().toISOString()
      ) {
        const workspace = get().workspace;
        if (!workspace) {
          return null;
        }

        const submissionsByQuestionId = upsertBestSubmission(
          workspace.workspace.submissionsByQuestionId,
          {
            questionId,
            code,
            result,
          },
          submittedAt
        );

        const nextWorkspace = withSummary({
          ...workspace,
          workspace: {
            ...workspace.workspace,
            submissionsByQuestionId,
          },
          lifecycle: {
            ...workspace.lifecycle,
            lastSavedAt: submittedAt,
          },
        });

        const persisted = await workspaceRepository.save(nextWorkspace);
        set((state) => ({
          ...state,
          workspace: persisted,
        }));

        return persisted;
      },

      async clearWorkspace() {
        await workspaceRepository.clear();
        set((state) => ({
          ...state,
          workspace: createEmptyWorkspace(questions),
          hydrationStatus: "ready",
        }));
      },

      flushPendingPersistence: scheduler.flushPendingPersistence,
    };
  });

  return store;
}
