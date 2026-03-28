"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  clearPracticeSession,
  loadPracticeSession,
  savePracticeSession,
} from "@/lib/api";
import {
  buildPracticeSummary,
  expireQuestionTimer,
  getQuestionTimerState,
  normalizePracticeSession,
  PRACTICE_MODE,
  PRACTICE_SESSION_VERSION,
  switchQuestionTimer,
} from "@/lib/practiceSession.mjs";
import { clampQuestionIndex } from "@/lib/workspaceNavigation.mjs";
import {
  sumSubmissionScores,
  upsertBestSubmission,
} from "@/lib/submissionState.mjs";

const ACTIONS = {
  LOAD_QUESTIONS: "LOAD_QUESTIONS",
  RECORD_SUBMISSION: "RECORD_SUBMISSION",
  RESTORE_SESSION: "RESTORE_SESSION",
  SAVE_DRAFT: "SAVE_DRAFT",
  SELECT_QUESTION: "SELECT_QUESTION",
  UPDATE_QUESTION_TIMERS: "UPDATE_QUESTION_TIMERS",
};

const initialState = {
  mode: PRACTICE_MODE,
  sessionVersion: PRACTICE_SESSION_VERSION,
  currentQuestionIndex: null,
  questions: [],
  submissions: {},
  drafts: {},
  questionTimers: {},
};

function hasPersistableState(state) {
  return (
    state.currentQuestionIndex !== null ||
    Object.keys(state.submissions).length > 0 ||
    Object.keys(state.drafts).length > 0 ||
    Object.keys(state.questionTimers).length > 0
  );
}

function practiceReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_QUESTIONS:
      return { ...state, questions: action.payload };

    case ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        ...action.payload,
      };

    case ACTIONS.SELECT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: action.payload.index,
        questionTimers: action.payload.questionTimers,
      };

    case ACTIONS.SAVE_DRAFT:
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [action.payload.questionId]: action.payload.code,
        },
      };

    case ACTIONS.RECORD_SUBMISSION: {
      const nextSubmissions = upsertBestSubmission(
        state.submissions,
        action.payload,
        action.payload.submittedAt
      );

      if (nextSubmissions === state.submissions) {
        return state;
      }

      return {
        ...state,
        submissions: nextSubmissions,
      };
    }

    case ACTIONS.UPDATE_QUESTION_TIMERS:
      return {
        ...state,
        questionTimers: action.payload,
      };

    default:
      return state;
  }
}

const PracticeContext = createContext(null);

export function PracticeProvider({ children }) {
  const [state, dispatch] = useReducer(practiceReducer, initialState);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!persistenceReady) {
      return undefined;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (!hasPersistableState(state)) {
      clearPracticeSession();
      return undefined;
    }

    saveTimeoutRef.current = setTimeout(() => {
      const { questions, ...sessionData } = state;
      savePracticeSession(sessionData);
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [persistenceReady, state]);

  const loadQuestions = useCallback((questions) => {
    dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: questions });
  }, []);

  const restoreSession = useCallback((questionCount) => {
    const savedSession = loadPracticeSession();
    setPersistenceReady(true);

    if (!savedSession) {
      return false;
    }

    dispatch({
      type: ACTIONS.RESTORE_SESSION,
      payload: normalizePracticeSession(savedSession, questionCount),
    });
    return true;
  }, []);

  const setQuestion = useCallback(
    (index) => {
      const nextIndex = clampQuestionIndex(index, state.questions.length);
      if (nextIndex === null) {
        return;
      }

      const previousQuestionId =
        state.currentQuestionIndex !== null
          ? state.questions[state.currentQuestionIndex]?.id ?? null
          : null;
      const nextQuestionId = state.questions[nextIndex]?.id;

      if (!nextQuestionId) {
        return;
      }

      dispatch({
        type: ACTIONS.SELECT_QUESTION,
        payload: {
          index: nextIndex,
          questionTimers: switchQuestionTimer(
            state.questionTimers,
            previousQuestionId,
            nextQuestionId
          ),
        },
      });
    },
    [state.currentQuestionIndex, state.questionTimers, state.questions]
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

  const expireQuestion = useCallback(
    (questionId) => {
      if (questionId === null || questionId === undefined) {
        return;
      }

      dispatch({
        type: ACTIONS.UPDATE_QUESTION_TIMERS,
        payload: expireQuestionTimer(state.questionTimers, questionId),
      });
    },
    [state.questionTimers]
  );

  const currentQuestion =
    state.currentQuestionIndex !== null
      ? state.questions[state.currentQuestionIndex] || null
      : null;

  const totalScore = useMemo(
    () => sumSubmissionScores(state.submissions),
    [state.submissions]
  );

  const maxPossibleScore = useMemo(
    () =>
      state.questions.reduce(
        (sum, question) => sum + (question.maxScore || 0),
        0
      ),
    [state.questions]
  );

  const getDraft = useCallback(
    (questionId, fallbackStarter) =>
      state.drafts[questionId] !== undefined
        ? state.drafts[questionId]
        : fallbackStarter || "",
    [state.drafts]
  );

  const getSubmissionStatus = useCallback(
    (questionId) => {
      const submission = state.submissions[questionId];
      if (!submission) {
        return null;
      }

      return {
        score: submission.score,
        passed: submission.passed,
        total: submission.total,
      };
    },
    [state.submissions]
  );

  const getQuestionTimerStatus = useCallback(
    (questionId) => {
      const question = state.questions.find((item) => item.id === questionId);
      return getQuestionTimerState(
        state.questionTimers,
        questionId,
        Date.now(),
        question?.timeLimitSeconds
      );
    },
    [state.questionTimers, state.questions]
  );

  const getSummary = useCallback(
    () =>
      buildPracticeSummary({
        questions: state.questions,
        questionTimers: state.questionTimers,
        submissions: state.submissions,
      }),
    [state.questionTimers, state.questions, state.submissions]
  );

  const value = useMemo(
    () => ({
      ...state,
      currentQuestion,
      currentQuestionTimer: currentQuestion
        ? getQuestionTimerStatus(currentQuestion.id)
        : null,
      totalScore,
      maxPossibleScore,
      loadQuestions,
      restoreSession,
      setQuestion,
      saveDraft,
      recordSubmission,
      expireQuestion,
      getDraft,
      getSubmissionStatus,
      getQuestionTimerStatus,
      getSummary,
    }),
    [
      currentQuestion,
      expireQuestion,
      getDraft,
      getQuestionTimerStatus,
      getSubmissionStatus,
      getSummary,
      loadQuestions,
      maxPossibleScore,
      recordSubmission,
      restoreSession,
      saveDraft,
      setQuestion,
      state,
      totalScore,
    ]
  );

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
}

export function usePractice() {
  const context = useContext(PracticeContext);

  if (!context) {
    throw new Error("usePractice must be used within a PracticeProvider");
  }

  return context;
}
