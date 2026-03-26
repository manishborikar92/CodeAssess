"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import { saveSession, loadSession, clearSession as clearStoredSession } from "@/lib/api";

// ── Action Types ─────────────────────────────────────────────────────────────
const ACTIONS = {
  LOAD_QUESTIONS: "LOAD_QUESTIONS",
  START_EXAM: "START_EXAM",
  FINISH_EXAM: "FINISH_EXAM",
  SET_QUESTION: "SET_QUESTION",
  SAVE_DRAFT: "SAVE_DRAFT",
  RECORD_SUBMISSION: "RECORD_SUBMISSION",
  RESTORE_SESSION: "RESTORE_SESSION",
  CLEAR_SESSION: "CLEAR_SESSION",
};

// ── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  status: "idle", // idle | active | finished
  startTime: null,
  currentQuestionIndex: 0,
  questions: [],
  submissions: {}, // questionId → { code, score, passed, total, results, submittedAt }
  drafts: {}, // questionId → code string
  totalDuration: 90 * 60, // 90 minutes in seconds
};

// ── Reducer ──────────────────────────────────────────────────────────────────
function examReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_QUESTIONS:
      return { ...state, questions: action.payload };

    case ACTIONS.START_EXAM:
      return {
        ...state,
        status: "active",
        startTime: new Date().toISOString(),
        currentQuestionIndex: 0,
        submissions: {},
        drafts: {},
      };

    case ACTIONS.FINISH_EXAM:
      return { ...state, status: "finished" };

    case ACTIONS.SET_QUESTION:
      return {
        ...state,
        currentQuestionIndex: Math.max(
          0,
          Math.min(state.questions.length - 1, action.payload)
        ),
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
      const { questionId, code, result } = action.payload;
      const existing = state.submissions[questionId];
      // Keep best submission
      if (!existing || result.score >= existing.score) {
        return {
          ...state,
          submissions: {
            ...state.submissions,
            [questionId]: {
              code,
              score: result.score,
              passed: result.passed,
              total: result.total,
              submittedAt: new Date().toISOString(),
            },
          },
        };
      }
      return state;
    }

    case ACTIONS.RESTORE_SESSION:
      return { ...state, ...action.payload };

    case ACTIONS.CLEAR_SESSION:
      return { ...initialState, questions: state.questions };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const saveTimeoutRef = useRef(null);

  // ── Auto-persist on state change (debounced) ──
  useEffect(() => {
    if (state.status === "idle") return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const { questions, ...sessionData } = state;
      saveSession(sessionData);
    }, 300);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state]);

  // ── Actions ──
  const loadQuestions = useCallback((questions) => {
    dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: questions });
  }, []);

  const startExam = useCallback(() => {
    clearStoredSession();
    dispatch({ type: ACTIONS.START_EXAM });
  }, []);

  const finishExam = useCallback(() => {
    dispatch({ type: ACTIONS.FINISH_EXAM });
  }, []);

  const setQuestion = useCallback((index) => {
    dispatch({ type: ACTIONS.SET_QUESTION, payload: index });
  }, []);

  const saveDraft = useCallback((questionId, code) => {
    dispatch({
      type: ACTIONS.SAVE_DRAFT,
      payload: { questionId, code },
    });
  }, []);

  const recordSubmission = useCallback((questionId, code, result) => {
    dispatch({
      type: ACTIONS.RECORD_SUBMISSION,
      payload: { questionId, code, result },
    });
  }, []);

  const restoreSession = useCallback(() => {
    const saved = loadSession();
    if (saved && saved.status === "active") {
      // Check if time is expired
      const elapsed = Math.floor(
        (Date.now() - new Date(saved.startTime).getTime()) / 1000
      );
      if (elapsed >= (saved.totalDuration || 5400)) {
        saved.status = "finished";
      }
      dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
      return true;
    }
    return false;
  }, []);

  const clearExamSession = useCallback(() => {
    clearStoredSession();
    dispatch({ type: ACTIONS.CLEAR_SESSION });
  }, []);

  // ── Computed values ──
  const currentQuestion = state.questions[state.currentQuestionIndex] || null;

  const totalScore = Object.values(state.submissions).reduce(
    (sum, s) => sum + (s.score || 0),
    0
  );

  const maxPossibleScore = state.questions.reduce(
    (sum, q) => sum + q.maxScore,
    0
  );

  const getDraft = useCallback(
    (questionId, fallbackStarter) => {
      return state.drafts[questionId] !== undefined
        ? state.drafts[questionId]
        : fallbackStarter || "";
    },
    [state.drafts]
  );

  const getSubmissionStatus = useCallback(
    (questionId) => {
      const sub = state.submissions[questionId];
      if (!sub) return null;
      return { score: sub.score, passed: sub.passed, total: sub.total };
    },
    [state.submissions]
  );

  const getSummary = useCallback(() => {
    const attempted = Object.keys(state.submissions).length;
    const elapsed = state.startTime
      ? Math.floor((Date.now() - new Date(state.startTime).getTime()) / 1000)
      : 0;

    const breakdown = state.questions.map((q) => ({
      id: q.id,
      title: q.title,
      section: q.section,
      score: state.submissions[q.id] ? state.submissions[q.id].score : 0,
      maxScore: q.maxScore,
      attempted: !!state.submissions[q.id],
      status: getSubmissionStatus(q.id),
    }));

    return { attempted, totalScore, maxPossibleScore, elapsed, breakdown };
  }, [state, totalScore, maxPossibleScore, getSubmissionStatus]);

  const value = {
    // State
    ...state,
    currentQuestion,
    totalScore,
    maxPossibleScore,

    // Actions
    loadQuestions,
    startExam,
    finishExam,
    setQuestion,
    saveDraft,
    recordSubmission,
    restoreSession,
    clearExamSession,

    // Getters
    getDraft,
    getSubmissionStatus,
    getSummary,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
}
