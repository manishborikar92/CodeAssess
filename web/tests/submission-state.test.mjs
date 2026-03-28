import assert from "node:assert/strict";

import {
  sumSubmissionScores,
  upsertBestSubmission,
} from "../src/lib/submissionState.mjs";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("upsertBestSubmission creates a new submission record", () => {
  const submissions = upsertBestSubmission(
    {},
    {
      code: "print(1)",
      questionId: 5,
      result: { score: 80, passed: 4, total: 5 },
    },
    Date.UTC(2026, 2, 29, 9, 0, 0)
  );

  assert.deepEqual(submissions[5], {
    code: "print(1)",
    score: 80,
    passed: 4,
    total: 5,
    submittedAt: new Date(Date.UTC(2026, 2, 29, 9, 0, 0)).toISOString(),
  });
});

test("upsertBestSubmission preserves the higher score for a question", () => {
  const existing = {
    5: {
      code: "best()",
      score: 100,
      passed: 5,
      total: 5,
      submittedAt: new Date(Date.UTC(2026, 2, 29, 9, 0, 0)).toISOString(),
    },
  };

  const submissions = upsertBestSubmission(
    existing,
    {
      code: "worse()",
      questionId: 5,
      result: { score: 60, passed: 3, total: 5 },
    },
    Date.UTC(2026, 2, 29, 9, 10, 0)
  );

  assert.equal(submissions, existing);
});

test("sumSubmissionScores totals scores across questions", () => {
  assert.equal(
    sumSubmissionScores({
      1: { score: 100 },
      2: { score: 40 },
      3: { score: 0 },
    }),
    140
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
  console.log(`Passed ${tests.length} submission state tests.`);
}
