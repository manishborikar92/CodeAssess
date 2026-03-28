import assert from "node:assert/strict";

import {
  QUESTION_TIME_LIMIT_SECONDS,
  buildPracticeSummary,
  getQuestionTimerState,
  normalizePracticeSession,
  pauseQuestionTimer,
  resumeQuestionTimer,
  switchQuestionTimer,
} from "../src/lib/practiceSession.mjs";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("resumeQuestionTimer starts an idle timer", () => {
  const now = Date.UTC(2026, 2, 28, 10, 0, 0);

  const timers = resumeQuestionTimer({}, 7, now);
  const timer = getQuestionTimerState(timers, 7, now);

  assert.equal(timer.isRunning, true);
  assert.equal(timer.hasStarted, true);
  assert.equal(timer.spentSeconds, 0);
  assert.equal(timer.remainingSeconds, QUESTION_TIME_LIMIT_SECONDS);
});

test("pauseQuestionTimer accumulates elapsed time and clears the running flag", () => {
  const start = Date.UTC(2026, 2, 28, 10, 0, 0);
  const end = start + 5 * 60 * 1000;

  const runningTimers = resumeQuestionTimer({}, 4, start);
  const pausedTimers = pauseQuestionTimer(runningTimers, 4, end);
  const timer = getQuestionTimerState(pausedTimers, 4, end);

  assert.equal(timer.isRunning, false);
  assert.equal(timer.spentSeconds, 5 * 60);
  assert.equal(timer.remainingSeconds, 25 * 60);
  assert.equal(timer.isExpired, false);
});

test("switchQuestionTimer pauses the previous question and starts the next one", () => {
  const firstStart = Date.UTC(2026, 2, 28, 10, 0, 0);
  const switchAt = firstStart + 2 * 60 * 1000;

  const firstQuestion = resumeQuestionTimer({}, 1, firstStart);
  const switched = switchQuestionTimer(firstQuestion, 1, 2, switchAt);

  const questionOne = getQuestionTimerState(switched, 1, switchAt);
  const questionTwo = getQuestionTimerState(switched, 2, switchAt);

  assert.equal(questionOne.isRunning, false);
  assert.equal(questionOne.spentSeconds, 2 * 60);
  assert.equal(questionTwo.isRunning, true);
  assert.equal(questionTwo.spentSeconds, 0);
});

test("getQuestionTimerState marks a question as expired once the limit is reached", () => {
  const start = Date.UTC(2026, 2, 28, 10, 0, 0);
  const expiredAt = start + QUESTION_TIME_LIMIT_SECONDS * 1000;

  const runningTimers = resumeQuestionTimer({}, 9, start);
  const pausedTimers = pauseQuestionTimer(runningTimers, 9, expiredAt);
  const timer = getQuestionTimerState(pausedTimers, 9, expiredAt);

  assert.equal(timer.isExpired, true);
  assert.equal(timer.remainingSeconds, 0);
  assert.equal(timer.spentSeconds, QUESTION_TIME_LIMIT_SECONDS);
});

test("buildPracticeSummary reports solved count, score, and time spent across questions", () => {
  const start = Date.UTC(2026, 2, 28, 10, 0, 0);
  const now = start + 8 * 60 * 1000;

  const questions = [
    { id: 1, title: "One", section: "A", maxScore: 100 },
    { id: 2, title: "Two", section: "B", maxScore: 100 },
  ];

  const timers = {
    1: {
      accumulatedSeconds: 8 * 60,
      startedAt: null,
      expiredAt: null,
    },
    2: {
      accumulatedSeconds: 0,
      startedAt: null,
      expiredAt: null,
    },
  };

  const submissions = {
    1: { score: 100, passed: 5, total: 5 },
  };

  const summary = buildPracticeSummary({
    questions,
    questionTimers: timers,
    submissions,
    now,
  });

  assert.equal(summary.attempted, 1);
  assert.equal(summary.solved, 1);
  assert.equal(summary.totalScore, 100);
  assert.equal(summary.maxPossibleScore, 200);
  assert.equal(summary.totalTimeSpent, 8 * 60);
  assert.equal(summary.breakdown[0].timer.remainingSeconds, 22 * 60);
});

test("normalizePracticeSession migrates legacy session data to the practice shape", () => {
  const legacySession = {
    status: "active",
    currentQuestionIndex: 3,
    drafts: { 4: "print('draft')" },
    submissions: { 4: { score: 50 } },
  };

  const normalized = normalizePracticeSession(legacySession, 5);

  assert.equal(normalized.mode, "practice");
  assert.equal(normalized.currentQuestionIndex, 3);
  assert.deepEqual(normalized.drafts, { 4: "print('draft')" });
  assert.deepEqual(normalized.submissions, { 4: { score: 50 } });
  assert.deepEqual(normalized.questionTimers, {});
});

let failed = false;

for (const { name, fn } of tests) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    failed = true;
    console.error("FAIL", name);
    console.error(error);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`Passed ${tests.length} practice session tests.`);
}
