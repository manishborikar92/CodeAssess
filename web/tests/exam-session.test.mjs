import assert from "node:assert/strict";

import {
  EXAM_DURATION_SECONDS,
  EXAM_MODE,
  EXAM_VIOLATION_LIMIT,
  finishExamSession,
  getExamTimerState,
  normalizeExamSession,
  registerIntegrityViolation,
  startExamSession,
} from "../src/lib/examSession.mjs";
import {
  clampQuestionIndex,
  getNextQuestionIndex,
  getPreviousQuestionIndex,
  getRandomQuestionIndex,
} from "../src/lib/workspaceNavigation.mjs";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("normalizeExamSession creates an idle exam session shape", () => {
  const session = normalizeExamSession(null, 2);

  assert.equal(session.mode, EXAM_MODE);
  assert.equal(session.durationSeconds, EXAM_DURATION_SECONDS);
  assert.equal(session.currentQuestionIndex, 0);
  assert.deepEqual(session.questionIds, []);
  assert.equal(session.status, "ready");
  assert.deepEqual(session.integrityViolations, []);
});

test("getExamTimerState reports remaining time for an active exam", () => {
  const start = Date.UTC(2026, 2, 29, 9, 0, 0);
  const now = start + 15 * 60 * 1000;

  const timer = getExamTimerState({
    status: "active",
    startedAt: new Date(start).toISOString(),
    durationSeconds: EXAM_DURATION_SECONDS,
  }, now);

  assert.equal(timer.elapsedSeconds, 15 * 60);
  assert.equal(timer.remainingSeconds, 75 * 60);
  assert.equal(timer.isExpired, false);
});

test("startExamSession marks the session active and stores the start timestamp", () => {
  const start = Date.UTC(2026, 2, 29, 9, 0, 0);
  const session = startExamSession(normalizeExamSession(null, 2), start);

  assert.equal(session.status, "active");
  assert.equal(session.startedAt, new Date(start).toISOString());
  assert.equal(session.finishedAt, null);
  assert.equal(session.finishReason, null);
});

test("finishExamSession closes the session with a reason and finished timestamp", () => {
  const start = Date.UTC(2026, 2, 29, 9, 0, 0);
  const finish = start + 90 * 60 * 1000;
  const activeSession = startExamSession(normalizeExamSession(null, 2), start);
  const finishedSession = finishExamSession(activeSession, "completed", finish);

  assert.equal(finishedSession.status, "completed");
  assert.equal(finishedSession.finishReason, "completed");
  assert.equal(finishedSession.finishedAt, new Date(finish).toISOString());
});

test("registerIntegrityViolation deduplicates rapid duplicate events", () => {
  const first = registerIntegrityViolation([], "tab-switch", Date.UTC(2026, 2, 29, 9, 0, 0));
  const second = registerIntegrityViolation(first.violations, "tab-switch", Date.UTC(2026, 2, 29, 9, 0, 0) + 250);

  assert.equal(first.violations.length, 1);
  assert.equal(second.violations.length, 1);
  assert.equal(second.shouldTerminate, false);
});

test("registerIntegrityViolation terminates after the configured limit", () => {
  const base = Date.UTC(2026, 2, 29, 9, 0, 0);
  let state = { violations: [], shouldTerminate: false };

  for (let index = 0; index < EXAM_VIOLATION_LIMIT; index += 1) {
    state = registerIntegrityViolation(
      state.violations,
      `violation-${index + 1}`,
      base + index * 2000
    );
  }

  assert.equal(state.violations.length, EXAM_VIOLATION_LIMIT);
  assert.equal(state.shouldTerminate, true);
});

test("workspace navigation moves backward and forward within bounds", () => {
  assert.equal(getPreviousQuestionIndex(0, 5), 0);
  assert.equal(getPreviousQuestionIndex(3, 5), 2);
  assert.equal(getNextQuestionIndex(4, 5), 4);
  assert.equal(getNextQuestionIndex(1, 5), 2);
});

test("clampQuestionIndex returns a safe index or null when unavailable", () => {
  assert.equal(clampQuestionIndex(-1, 4), 0);
  assert.equal(clampQuestionIndex(10, 4), 3);
  assert.equal(clampQuestionIndex(2, 4), 2);
  assert.equal(clampQuestionIndex(1, 0), null);
  assert.equal(clampQuestionIndex("1", 4), null);
});

test("workspace shuffle never returns the same question when alternatives exist", () => {
  const randomIndex = getRandomQuestionIndex(2, 5, () => 0.9);
  assert.notEqual(randomIndex, 2);
  assert.equal(randomIndex, 4);
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
  console.log(`Passed ${tests.length} exam session tests.`);
}
