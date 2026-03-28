import questionsData from "@/data/questions.json";
import {
  PRACTICE_MODE,
  PRACTICE_SESSION_VERSION,
  QUESTION_TIME_LIMIT_SECONDS,
  withQuestionTimeLimit,
} from "@/lib/practiceSession.mjs";

const PRACTICE_STORAGE_KEY = "codeassess_practice_session";
const LEGACY_SESSION_STORAGE_KEY = "codeassess_session";

/**
 * Fetch all questions for the client-side practice workspace.
 * Future: Replace with a typed API client backed by NestJS.
 */
export async function getQuestions() {
  return withQuestionTimeLimit(questionsData);
}

/**
 * Fetch a single question by its ID.
 * Future: Replace with fetch(`/api/questions/${id}`)
 */
export async function getQuestionById(id) {
  const questions = await getQuestions();
  return questions.find((question) => question.id === id) || null;
}

/**
 * Get practice workspace configuration.
 * Future: Replace with fetch('/api/practice/config')
 */
export async function getPracticeConfig() {
  const questions = await getQuestions();
  const totalScore = questions.reduce(
    (sum, question) => sum + question.maxScore,
    0
  );

  return {
    mode: PRACTICE_MODE,
    sessionVersion: PRACTICE_SESSION_VERSION,
    title: "Coding Practice Workspace",
    subtitle: "Solve any question in any order",
    totalQuestions: questions.length,
    questionTimeLimitMinutes: QUESTION_TIME_LIMIT_SECONDS / 60,
    totalScore,
    language: "Python 3",
  };
}

export async function getExamConfig() {
  return getPracticeConfig();
}

/**
 * Submit a solution (no-op for now, future: POST to backend).
 */
export async function submitSolution(questionId, code, results) {
  return { success: true, questionId, code, ...results };
}

/**
 * Load practice session state from persistence.
 * Future: GET /api/practice/sessions/:id
 */
export function loadPracticeSession(
  storageKey = PRACTICE_STORAGE_KEY,
  legacyStorageKey = LEGACY_SESSION_STORAGE_KEY
) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }

    const legacyRaw = localStorage.getItem(legacyStorageKey);
    return legacyRaw ? JSON.parse(legacyRaw) : null;
  } catch {
    return null;
  }
}

/**
 * Save practice session state to persistence.
 * Future: PUT /api/practice/sessions/:id
 */
export function savePracticeSession(state, storageKey = PRACTICE_STORAGE_KEY) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...state,
        mode: PRACTICE_MODE,
        sessionVersion: PRACTICE_SESSION_VERSION,
      })
    );
  } catch {
    // Storage full or unavailable.
  }
}

/**
 * Clear the persisted practice session.
 */
export function clearPracticeSession(
  storageKey = PRACTICE_STORAGE_KEY,
  legacyStorageKey = LEGACY_SESSION_STORAGE_KEY
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(storageKey);
  localStorage.removeItem(legacyStorageKey);
}

export const loadSession = loadPracticeSession;
export const saveSession = savePracticeSession;
export const clearSession = clearPracticeSession;
