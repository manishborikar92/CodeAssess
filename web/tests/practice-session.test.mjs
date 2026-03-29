import assert from "node:assert/strict";

import {
  buildPracticeSummary,
  normalizePracticeSession,
} from "../src/lib/session/practiceSession.mjs";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("buildPracticeSummary reports score, solved count, and draft progress without timer state", () => {
  const questions = [
    { id: 1, title: "One", difficulty: "easy", maxScore: 100 },
    { id: 2, title: "Two", difficulty: "medium", maxScore: 100 },
  ];

  const summary = buildPracticeSummary({
    questions,
    drafts: {
      2: {
        code: "print('draft')",
        language: "python",
        updatedAt: "2026-03-28T10:05:00.000Z",
      },
    },
    submissions: {
      1: { score: 100, passed: 5, total: 5 },
    },
  });

  assert.equal(summary.attempted, 1);
  assert.equal(summary.solved, 1);
  assert.equal(summary.totalScore, 100);
  assert.equal(summary.maxPossibleScore, 200);
  assert.equal(summary.draftCount, 1);
  assert.equal(summary.breakdown[0].hasDraft, false);
  assert.equal(summary.breakdown[1].hasDraft, true);
  assert.equal("timer" in summary.breakdown[0], false);
});

test("normalizePracticeSession drops legacy timer data from the practice session shape", () => {
  const legacySession = {
    status: "active",
    currentQuestionIndex: 3,
    drafts: { 4: "print('draft')" },
    submissions: { 4: { score: 50 } },
    questionTimers: {
      4: {
        isEnabled: true,
      },
    },
  };

  const normalized = normalizePracticeSession(legacySession, 5);

  assert.equal(normalized.mode, "practice");
  assert.equal(normalized.currentQuestionIndex, 3);
  assert.deepEqual(normalized.drafts, { 4: "print('draft')" });
  assert.deepEqual(normalized.submissions, { 4: { score: 50 } });
  assert.equal("questionTimers" in normalized, false);
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
