export const EXAM_MODE = "exam";
export const EXAM_DURATION_SECONDS = 90 * 60;
export const EXAM_VIOLATION_LIMIT = 3;
export const EXAM_SESSION_VERSION = 1;
const VIOLATION_DEDUPLICATION_WINDOW_MS = 1000;

export function normalizeExamSession(savedSession, questionCount) {
  return {
    mode: EXAM_MODE,
    sessionVersion: EXAM_SESSION_VERSION,
    status: savedSession?.status || "ready",
    currentQuestionIndex:
      Number.isInteger(savedSession?.currentQuestionIndex) && questionCount > 0
        ? Math.max(0, Math.min(questionCount - 1, savedSession.currentQuestionIndex))
        : 0,
    durationSeconds: EXAM_DURATION_SECONDS,
    startedAt: savedSession?.startedAt || null,
    finishedAt: savedSession?.finishedAt || null,
    finishReason: savedSession?.finishReason || null,
    acceptedRules: savedSession?.acceptedRules || false,
    integrityViolations: Array.isArray(savedSession?.integrityViolations)
      ? savedSession.integrityViolations
      : [],
    submissions: savedSession?.submissions && typeof savedSession.submissions === "object"
      ? savedSession.submissions
      : {},
    drafts: savedSession?.drafts && typeof savedSession.drafts === "object"
      ? savedSession.drafts
      : {},
  };
}

export function startExamSession(session, startedAt = Date.now()) {
  return {
    ...session,
    status: "active",
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: null,
    finishReason: null,
  };
}

export function finishExamSession(
  session,
  reason = "completed",
  finishedAt = Date.now()
) {
  return {
    ...session,
    status: reason,
    finishedAt: new Date(finishedAt).toISOString(),
    finishReason: reason,
  };
}

export function getExamTimerState(session, now = Date.now()) {
  if (!session?.startedAt || session.status !== "active") {
    return {
      elapsedSeconds: 0,
      remainingSeconds: session?.durationSeconds || EXAM_DURATION_SECONDS,
      isExpired: false,
      isRunning: false,
    };
  }

  const startedAtMs = new Date(session.startedAt).getTime();
  const elapsedSeconds = Math.min(
    session.durationSeconds || EXAM_DURATION_SECONDS,
    Math.max(0, Math.floor((now - startedAtMs) / 1000))
  );
  const remainingSeconds = Math.max(
    0,
    (session.durationSeconds || EXAM_DURATION_SECONDS) - elapsedSeconds
  );

  return {
    elapsedSeconds,
    remainingSeconds,
    isExpired: remainingSeconds === 0,
    isRunning: remainingSeconds > 0,
  };
}

export function registerIntegrityViolation(
  violations,
  type,
  timestamp = Date.now(),
  limit = EXAM_VIOLATION_LIMIT
) {
  const nextTimestamp = new Date(timestamp).toISOString();
  const lastViolation = violations.at(-1);
  const lastTimestamp = lastViolation ? new Date(lastViolation.timestamp).getTime() : null;

  if (
    lastViolation &&
    lastViolation.type === type &&
    Number.isFinite(lastTimestamp) &&
    timestamp - lastTimestamp < VIOLATION_DEDUPLICATION_WINDOW_MS
  ) {
    return {
      violations,
      shouldTerminate: violations.length >= limit,
    };
  }

  const nextViolations = [
    ...violations,
    {
      type,
      timestamp: nextTimestamp,
    },
  ];

  return {
    violations: nextViolations,
    shouldTerminate: nextViolations.length >= limit,
  };
}
