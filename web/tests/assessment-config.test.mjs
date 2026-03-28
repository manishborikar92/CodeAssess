import assert from "node:assert/strict";

import {
  EXAM_QUESTION_COUNT,
  buildExamConfig,
  buildPracticeConfig,
  getOrderedQuestionSubset,
} from "../src/lib/assessmentConfig.mjs";
import {
  EXAM_DURATION_SECONDS,
  EXAM_MODE,
  EXAM_VIOLATION_LIMIT,
} from "../src/lib/examSession.mjs";
import { QUESTION_TIME_LIMIT_SECONDS } from "../src/lib/practiceSession.mjs";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

const questionPool = [
  { id: 11, title: "One", maxScore: 100 },
  { id: 12, title: "Two", maxScore: 150 },
  { id: 13, title: "Three", maxScore: 200 },
];

test("buildPracticeConfig exposes the practice timer and full question pool", () => {
  const config = buildPracticeConfig(questionPool);

  assert.equal(config.mode, "practice");
  assert.equal(config.totalQuestions, questionPool.length);
  assert.equal(config.questionTimeLimitMinutes, QUESTION_TIME_LIMIT_SECONDS / 60);
  assert.equal(config.totalScore, 450);
});

test("buildExamConfig selects a focused exam set with secure-mode rules", () => {
  const config = buildExamConfig(questionPool);

  assert.equal(config.mode, EXAM_MODE);
  assert.equal(config.totalQuestions, EXAM_QUESTION_COUNT);
  assert.deepEqual(config.questionIds, [11, 12]);
  assert.equal(config.durationMinutes, EXAM_DURATION_SECONDS / 60);
  assert.equal(config.totalScore, 250);
  assert.equal(config.integrityPolicy.maxViolations, EXAM_VIOLATION_LIMIT);
  assert.equal(config.integrityPolicy.requireFullscreen, true);
  assert.equal(config.integrityPolicy.blockClipboard, true);
});

test("getOrderedQuestionSubset preserves the configured exam order", () => {
  const subset = getOrderedQuestionSubset(questionPool, [13, 11]);
  assert.deepEqual(
    subset.map((question) => question.id),
    [13, 11]
  );
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
  console.log(`Passed ${tests.length} assessment config tests.`);
}
