"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  clearExamSession,
  getExamConfig,
  getQuestions,
  loadExamSession,
  saveExamSession,
} from "@/lib/api";
import {
  EXAM_QUESTION_COUNT,
  getOrderedQuestionSubset,
  selectRandomQuestionSubset,
} from "@/lib/assessmentConfig.mjs";
import {
  EXAM_DURATION_SECONDS,
  finishExamSession,
  getExamTimerState,
  normalizeExamSession,
  registerIntegrityViolation,
  startExamSession,
} from "@/lib/examSession.mjs";
import { clampQuestionIndex } from "@/lib/workspaceNavigation.mjs";
import {
  sumSubmissionScores,
  upsertBestSubmission,
} from "@/lib/submissionState.mjs";

const ACTIONS = {
  ACCEPT_RULES: "ACCEPT_RULES",
  FINISH_EXAM: "FINISH_EXAM",
  LOAD_SUCCESS: "LOAD_SUCCESS",
  RECORD_SUBMISSION: "RECORD_SUBMISSION",
  RESET_EXAM: "RESET_EXAM",
  SAVE_DRAFT: "SAVE_DRAFT",
  SET_QUESTION: "SET_QUESTION",
  SET_VIOLATIONS: "SET_VIOLATIONS",
  START_EXAM: "START_EXAM",
};

const initialState = {
  config: null,
  questionPool: [],
  questions: [],
  session: normalizeExamSession(null, 0),
  isLoading: true,
};

function getLegacyExamQuestionIds(questionPool, questionCount) {
  return questionPool.slice(0, questionCount).map((question) => question.id);
}

function resolvePersistedQuestionIds(savedSession, questionPool, questionCount) {
  if (Array.isArray(savedSession?.questionIds) && savedSession.questionIds.length > 0) {
    return savedSession.questionIds.filter(Number.isInteger);
  }

  if (savedSession?.status && savedSession.status !== "ready") {
    return getLegacyExamQuestionIds(questionPool, questionCount);
  }

  return [];
}

function isFinalExamStatus(status) {
  return (
    status === "completed" ||
    status === "time-limit" ||
    status === "integrity-limit"
  );
}

function examReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        config: action.payload.config,
        questionPool: action.payload.questionPool,
        questions: action.payload.questions,
        session: action.payload.session,
        isLoading: false,
      };

    case ACTIONS.ACCEPT_RULES:
      return {
        ...state,
        session: {
          ...state.session,
          acceptedRules: action.payload,
        },
      };

    case ACTIONS.START_EXAM:
      if (state.session.status !== "ready") {
        return state;
      }

      return {
        ...state,
        questions: action.payload.questions,
        session: startExamSession(
          {
            ...state.session,
            currentQuestionIndex: 0,
            questionIds: action.payload.questionIds,
          },
          action.payload.startedAt
        ),
      };

    case ACTIONS.SET_QUESTION:
      return {
        ...state,
        session: {
          ...state.session,
          currentQuestionIndex: action.payload,
        },
      };

    case ACTIONS.SAVE_DRAFT:
      if (isFinalExamStatus(state.session.status)) {
        return state;
      }

      return {
        ...state,
        session: {
          ...state.session,
          drafts: {
            ...state.session.drafts,
            [action.payload.questionId]: action.payload.code,
          },
        },
      };

    case ACTIONS.RECORD_SUBMISSION: {
      if (isFinalExamStatus(state.session.status)) {
        return state;
      }

      const nextSubmissions = upsertBestSubmission(
        state.session.submissions,
        action.payload,
        action.payload.submittedAt
      );

      if (nextSubmissions === state.session.submissions) {
        return state;
      }

      return {
        ...state,
        session: {
          ...state.session,
          submissions: nextSubmissions,
        },
      };
    }

    case ACTIONS.SET_VIOLATIONS:
      if (state.session.status !== "active") {
        return state;
      }

      return {
        ...state,
        session: {
          ...state.session,
          integrityViolations: action.payload,
        },
      };

    case ACTIONS.FINISH_EXAM:
      if (isFinalExamStatus(state.session.status)) {
        return state;
      }

      return {
        ...state,
        session: finishExamSession(
          state.session,
          action.payload.reason,
          action.payload.finishedAt
        ),
      };

    case ACTIONS.RESET_EXAM:
      return {
        ...state,
        questions: [],
        session: normalizeExamSession(null, 0),
      };

    default:
      return state;
  }
}

const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, initialState);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [config, questionPool] = await Promise.all([
        getExamConfig(),
        getQuestions(),
      ]);
      const savedSession = loadExamSession();
      const questionCount =
        config?.questionSelection?.count ?? Math.min(EXAM_QUESTION_COUNT, questionPool.length);
      const persistedQuestionIds = resolvePersistedQuestionIds(
        savedSession,
        questionPool,
        questionCount
      );
      const questions = getOrderedQuestionSubset(questionPool, persistedQuestionIds);
      const session = normalizeExamSession(
        { ...savedSession, questionIds: persistedQuestionIds },
        questions.length
      );

      if (cancelled) {
        return;
      }

      dispatch({
        type: ACTIONS.LOAD_SUCCESS,
        payload: { config, questionPool, questions, session },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.isLoading) {
      return;
    }

    saveExamSession(state.session);
  }, [state.isLoading, state.session]);

  const acceptRules = useCallback((acceptedRules) => {
    dispatch({ type: ACTIONS.ACCEPT_RULES, payload: acceptedRules });
  }, []);

  const startExam = useCallback((startedAt = Date.now()) => {
    const selectionCount =
      state.config?.questionSelection?.count ??
      Math.min(EXAM_QUESTION_COUNT, state.questionPool.length);
    const selectedQuestions = selectRandomQuestionSubset(
      state.questionPool,
      selectionCount
    );
    const questionIds = selectedQuestions.map((question) => question.id);

    if (selectedQuestions.length === 0) {
      return false;
    }

    dispatch({
      type: ACTIONS.START_EXAM,
      payload: { startedAt, questionIds, questions: selectedQuestions },
    });
    return true;
  }, [state.config?.questionSelection?.count, state.questionPool]);

  const setQuestion = useCallback(
    (index) => {
      const nextIndex = clampQuestionIndex(index, state.questions.length);
      if (nextIndex === null) {
        return;
      }

      dispatch({ type: ACTIONS.SET_QUESTION, payload: nextIndex });
    },
    [state.questions.length]
  );

  const saveDraft = useCallback((questionId, code) => {
    dispatch({
      type: ACTIONS.SAVE_DRAFT,
      payload: { questionId, code },
    });
  }, []);

  const recordSubmission = useCallback((questionId, code, result, submittedAt = Date.now()) => {
    dispatch({
      type: ACTIONS.RECORD_SUBMISSION,
      payload: { questionId, code, result, submittedAt },
    });
  }, []);

  const recordIntegrityViolation = useCallback(
    (type, timestamp = Date.now()) => {
      if (state.session.status !== "active") {
        return {
          violations: state.session.integrityViolations,
          shouldTerminate: false,
        };
      }

      const outcome = registerIntegrityViolation(
        state.session.integrityViolations,
        type,
        timestamp,
        state.config?.integrityPolicy.maxViolations
      );

      if (outcome.violations.length !== state.session.integrityViolations.length) {
        dispatch({
          type: ACTIONS.SET_VIOLATIONS,
          payload: outcome.violations,
        });
      }

      return outcome;
    },
    [
      state.config?.integrityPolicy.maxViolations,
      state.session.integrityViolations,
      state.session.status,
    ]
  );

  const finishExam = useCallback((reason = "completed", finishedAt = Date.now()) => {
    dispatch({
      type: ACTIONS.FINISH_EXAM,
      payload: { reason, finishedAt },
    });
  }, []);

  const resetExam = useCallback(() => {
    clearExamSession();
    dispatch({ type: ACTIONS.RESET_EXAM });
  }, []);

  const currentQuestion =
    state.questions[state.session.currentQuestionIndex] ||
    state.questions[0] ||
    null;
  const timerState = getExamTimerState(state.session);
  const totalScore = useMemo(
    () => sumSubmissionScores(state.session.submissions || {}),
    [state.session.submissions]
  );
  const maxScore = useMemo(
    () =>
      state.questions.reduce((sum, question) => sum + (question.maxScore || 0), 0),
    [state.questions]
  );

  const getDraft = useCallback(
    (questionId, fallbackStarter) =>
      state.session.drafts?.[questionId] !== undefined
        ? state.session.drafts[questionId]
        : fallbackStarter || "",
    [state.session.drafts]
  );

  const value = useMemo(
    () => ({
      ...state,
      currentQuestion,
      timerState,
      totalScore,
      maxScore,
      durationSeconds: state.session.durationSeconds || EXAM_DURATION_SECONDS,
      acceptRules,
      startExam,
      setQuestion,
      saveDraft,
      recordSubmission,
      recordIntegrityViolation,
      finishExam,
      resetExam,
      getDraft,
    }),
    [
      acceptRules,
      currentQuestion,
      finishExam,
      getDraft,
      maxScore,
      recordIntegrityViolation,
      recordSubmission,
      resetExam,
      saveDraft,
      setQuestion,
      startExam,
      state,
      timerState,
      totalScore,
    ]
  );

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
  const context = useContext(ExamContext);

  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }

  return context;
}
