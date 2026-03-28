import { clampQuestionIndex } from "./workspaceNavigation.mjs";

export const PRACTICE_MODE = "practice";
export const PRACTICE_SESSION_VERSION = 2;
export const QUESTION_TIME_LIMIT_SECONDS = 30 * 60;

function createDefaultTimer() {
  return {
    accumulatedSeconds: 0,
    startedAt: null,
    expiredAt: null,
  };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toIsoTimestamp(now) {
  return new Date(now).toISOString();
}

export function withQuestionTimeLimit(questions) {
  return questions.map((question) => ({
    ...question,
    timeLimitSeconds:
      Number.isFinite(question.timeLimitSeconds) && question.timeLimitSeconds > 0
        ? question.timeLimitSeconds
        : QUESTION_TIME_LIMIT_SECONDS,
  }));
}

export function getTimerRecord(questionTimers = {}, questionId) {
  const timer = questionTimers[String(questionId)];

  if (!isPlainObject(timer)) {
    return createDefaultTimer();
  }

  return {
    accumulatedSeconds:
      Number.isFinite(timer.accumulatedSeconds) && timer.accumulatedSeconds > 0
        ? timer.accumulatedSeconds
        : 0,
    startedAt: typeof timer.startedAt === "string" ? timer.startedAt : null,
    expiredAt: typeof timer.expiredAt === "string" ? timer.expiredAt : null,
  };
}

export function getElapsedSeconds(timerRecord, now = Date.now(), limitSeconds = QUESTION_TIME_LIMIT_SECONDS) {
  const baseSeconds = Math.max(0, Math.floor(timerRecord.accumulatedSeconds || 0));

  if (!timerRecord.startedAt) {
    return Math.min(baseSeconds, limitSeconds);
  }

  const startedAt = new Date(timerRecord.startedAt).getTime();
  if (!Number.isFinite(startedAt)) {
    return Math.min(baseSeconds, limitSeconds);
  }

  const liveSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  return Math.min(baseSeconds + liveSeconds, limitSeconds);
}

export function getRemainingSeconds(timerRecord, now = Date.now(), limitSeconds = QUESTION_TIME_LIMIT_SECONDS) {
  return Math.max(0, limitSeconds - getElapsedSeconds(timerRecord, now, limitSeconds));
}

export function getQuestionTimerState(
  questionTimers,
  questionId,
  now = Date.now(),
  limitSeconds = QUESTION_TIME_LIMIT_SECONDS
) {
  const timerRecord = getTimerRecord(questionTimers, questionId);
  const spentSeconds = getElapsedSeconds(timerRecord, now, limitSeconds);
  const remainingSeconds = Math.max(0, limitSeconds - spentSeconds);
  const hasStarted = spentSeconds > 0 || Boolean(timerRecord.startedAt) || Boolean(timerRecord.expiredAt);
  const isExpired = remainingSeconds === 0 && hasStarted;

  return {
    ...timerRecord,
    spentSeconds,
    remainingSeconds,
    hasStarted,
    isExpired,
    isRunning: Boolean(timerRecord.startedAt) && !isExpired,
  };
}

export function resumeQuestionTimer(
  questionTimers,
  questionId,
  now = Date.now(),
  limitSeconds = QUESTION_TIME_LIMIT_SECONDS
) {
  const timerState = getQuestionTimerState(questionTimers, questionId, now, limitSeconds);

  if (timerState.isExpired || timerState.isRunning) {
    return questionTimers;
  }

  return {
    ...questionTimers,
    [String(questionId)]: {
      accumulatedSeconds: timerState.spentSeconds,
      startedAt: toIsoTimestamp(now),
      expiredAt: timerState.expiredAt,
    },
  };
}

export function pauseQuestionTimer(
  questionTimers,
  questionId,
  now = Date.now(),
  limitSeconds = QUESTION_TIME_LIMIT_SECONDS
) {
  const timerState = getQuestionTimerState(questionTimers, questionId, now, limitSeconds);

  if (!timerState.isRunning) {
    return questionTimers;
  }

  const isExpired = timerState.remainingSeconds === 0;

  return {
    ...questionTimers,
    [String(questionId)]: {
      accumulatedSeconds: timerState.spentSeconds,
      startedAt: null,
      expiredAt: isExpired ? timerState.expiredAt || toIsoTimestamp(now) : timerState.expiredAt,
    },
  };
}

export function expireQuestionTimer(questionTimers, questionId, now = Date.now()) {
  const timerState = getQuestionTimerState(questionTimers, questionId, now);

  return {
    ...questionTimers,
    [String(questionId)]: {
      accumulatedSeconds: QUESTION_TIME_LIMIT_SECONDS,
      startedAt: null,
      expiredAt: timerState.expiredAt || toIsoTimestamp(now),
    },
  };
}

export function switchQuestionTimer(
  questionTimers,
  previousQuestionId,
  nextQuestionId,
  now = Date.now(),
  limitSeconds = QUESTION_TIME_LIMIT_SECONDS
) {
  if (previousQuestionId === nextQuestionId) {
    return questionTimers;
  }

  let nextTimers = questionTimers;

  if (previousQuestionId !== null && previousQuestionId !== undefined) {
    nextTimers = pauseQuestionTimer(nextTimers, previousQuestionId, now, limitSeconds);
  }

  if (nextQuestionId === null || nextQuestionId === undefined) {
    return nextTimers;
  }

  return resumeQuestionTimer(nextTimers, nextQuestionId, now, limitSeconds);
}

export function buildPracticeSummary({
  questions,
  questionTimers,
  submissions,
  now = Date.now(),
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
    const timer = getQuestionTimerState(
      questionTimers,
      question.id,
      now,
      question.timeLimitSeconds || QUESTION_TIME_LIMIT_SECONDS
    );

    return {
      id: question.id,
      title: question.title,
      section: question.section,
      score: submission ? submission.score || 0 : 0,
      maxScore: question.maxScore,
      attempted: Boolean(submission),
      timer,
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
    totalTimeSpent: breakdown.reduce(
      (sum, question) => sum + question.timer.spentSeconds,
      0
    ),
    breakdown,
  };
}

function sanitizeQuestionTimers(questionTimers) {
  if (!isPlainObject(questionTimers)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(questionTimers)
      .filter(([questionId]) => questionId !== "")
      .map(([questionId, timer]) => [
        questionId,
        getTimerRecord({ [questionId]: timer }, questionId),
      ])
  );
}

export function normalizePracticeSession(savedSession, questionCount) {
  if (!isPlainObject(savedSession)) {
    return {
      mode: PRACTICE_MODE,
      currentQuestionIndex: null,
      submissions: {},
      drafts: {},
      questionTimers: {},
      sessionVersion: PRACTICE_SESSION_VERSION,
    };
  }

  return {
    mode: PRACTICE_MODE,
    currentQuestionIndex: clampQuestionIndex(
      savedSession.currentQuestionIndex,
      questionCount
    ),
    submissions: isPlainObject(savedSession.submissions)
      ? savedSession.submissions
      : {},
    drafts: isPlainObject(savedSession.drafts) ? savedSession.drafts : {},
    questionTimers: sanitizeQuestionTimers(savedSession.questionTimers),
    sessionVersion: PRACTICE_SESSION_VERSION,
  };
}
