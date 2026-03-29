import { clampQuestionIndex } from "../workspace/navigation.mjs";

export const PRACTICE_MODE = "practice";
export const PRACTICE_SESSION_VERSION = 3;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeDraftRecord(value, fallbackUpdatedAt) {
  if (typeof value === "string") {
    return {
      code: value,
      language: "python",
      updatedAt: fallbackUpdatedAt,
    };
  }

  if (!isPlainObject(value) || typeof value.code !== "string") {
    return null;
  }

  return {
    code: value.code,
    language: typeof value.language === "string" ? value.language : "python",
    updatedAt:
      typeof value.updatedAt === "string" ? value.updatedAt : fallbackUpdatedAt,
  };
}

function normalizeDrafts(drafts, fallbackUpdatedAt) {
  if (!isPlainObject(drafts)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(drafts)
      .map(([questionId, value]) => [
        questionId,
        normalizeDraftRecord(value, fallbackUpdatedAt),
      ])
      .filter(([, value]) => Boolean(value))
  );
}

function normalizeSubmissions(submissions) {
  if (!isPlainObject(submissions)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(submissions).filter(([, value]) => isPlainObject(value))
  );
}

function hasDraftContent(draft) {
  if (typeof draft === "string") {
    return draft.trim().length > 0;
  }

  return typeof draft?.code === "string" && draft.code.trim().length > 0;
}

export function normalizePracticeWorkspaceRecord(
  savedWorkspace,
  now = new Date().toISOString()
) {
  const createdAt =
    typeof savedWorkspace?.lifecycle?.createdAt === "string"
      ? savedWorkspace.lifecycle.createdAt
      : now;
  const lastOpenedAt =
    typeof savedWorkspace?.lifecycle?.lastOpenedAt === "string"
      ? savedWorkspace.lifecycle.lastOpenedAt
      : createdAt;
  const lastSavedAt =
    typeof savedWorkspace?.lifecycle?.lastSavedAt === "string"
      ? savedWorkspace.lifecycle.lastSavedAt
      : lastOpenedAt;

  return {
    id: "default",
    schemaVersion: PRACTICE_SESSION_VERSION,
    mode: PRACTICE_MODE,
    lifecycle: {
      createdAt,
      lastOpenedAt,
      lastSavedAt,
    },
    navigation: {
      currentQuestionId: Number.isInteger(savedWorkspace?.navigation?.currentQuestionId)
        ? savedWorkspace.navigation.currentQuestionId
        : null,
    },
    workspace: {
      draftsByQuestionId: normalizeDrafts(
        savedWorkspace?.workspace?.draftsByQuestionId,
        lastSavedAt
      ),
      submissionsByQuestionId: normalizeSubmissions(
        savedWorkspace?.workspace?.submissionsByQuestionId
      ),
    },
  };
}

export function buildPracticeSummary({
  questions,
  drafts = {},
  submissions = {},
}) {
  const totalScore = Object.values(submissions).reduce(
    (sum, submission) => sum + (submission.score || 0),
    0
  );

  const maxPossibleScore = questions.reduce(
    (sum, question) => sum + (question.maxScore || 0),
    0
  );

  const breakdown = questions.map((question) => {
    const submission = submissions[question.id] || null;
    const draft = drafts[question.id] || null;

    return {
      id: question.id,
      title: question.title,
      topic: question.topic,
      difficulty: question.difficulty,
      score: submission ? submission.score || 0 : 0,
      maxScore: question.maxScore,
      attempted: Boolean(submission),
      hasDraft: hasDraftContent(draft),
      status: submission
        ? {
            score: submission.score || 0,
            passed: submission.passed || 0,
            total: submission.total || 0,
          }
        : null,
    };
  });

  return {
    attempted: breakdown.filter((question) => question.attempted).length,
    solved: breakdown.filter((question) => question.score >= question.maxScore).length,
    totalScore,
    maxPossibleScore,
    draftCount: breakdown.filter((question) => question.hasDraft).length,
    breakdown,
  };
}

export function normalizePracticeSession(savedSession, questionCount) {
  if (!isPlainObject(savedSession)) {
    return {
      mode: PRACTICE_MODE,
      currentQuestionIndex: null,
      submissions: {},
      drafts: {},
      sessionVersion: PRACTICE_SESSION_VERSION,
    };
  }

  return {
    mode: PRACTICE_MODE,
    currentQuestionIndex: clampQuestionIndex(
      savedSession.currentQuestionIndex,
      questionCount
    ),
    submissions: normalizeSubmissions(savedSession.submissions),
    drafts: savedSession.drafts && typeof savedSession.drafts === "object"
      ? savedSession.drafts
      : {},
    sessionVersion: PRACTICE_SESSION_VERSION,
  };
}
