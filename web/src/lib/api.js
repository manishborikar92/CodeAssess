// ─────────────────────────────────────────────────────────────────────────────
//  api.js — Data access abstraction layer
//  Currently reads from local JSON; easily swappable to fetch() calls.
// ─────────────────────────────────────────────────────────────────────────────

import questionsData from "@/data/questions.json";

/**
 * Fetch all questions for the exam.
 * Future: Replace with fetch('/api/questions')
 */
export async function getQuestions() {
  return questionsData;
}

/**
 * Fetch a single question by its ID.
 * Future: Replace with fetch(`/api/questions/${id}`)
 */
export async function getQuestionById(id) {
  return questionsData.find((q) => q.id === id) || null;
}

/**
 * Get exam configuration.
 * Future: Replace with fetch('/api/exam/config')
 */
export async function getExamConfig() {
  const questions = await getQuestions();
  const totalScore = questions.reduce((sum, q) => sum + q.maxScore, 0);
  return {
    title: "Coding Assessment",
    subtitle: "Programming Challenge Platform",
    totalQuestions: questions.length,
    durationMinutes: 90,
    totalScore,
    language: "Python 3",
  };
}

/**
 * Submit a solution (no-op for now, future: POST to backend).
 */
export async function submitSolution(questionId, code, results) {
  // Future: POST to /api/submissions
  return { success: true, questionId, ...results };
}

/**
 * Load exam session from persistence.
 * Future: GET /api/sessions/:id
 */
export function loadSession(storageKey = "codeassess_session") {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save exam session to persistence.
 * Future: PUT /api/sessions/:id
 */
export function saveSession(state, storageKey = "codeassess_session") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Clear exam session.
 */
export function clearSession(storageKey = "codeassess_session") {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey);
}
