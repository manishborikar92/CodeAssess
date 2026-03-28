import assert from "node:assert/strict";

import {
  normalizeQuestion,
  normalizeQuestionDifficulty,
} from "../src/lib/questionCatalog.mjs";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("normalizeQuestionDifficulty maps legacy values to easy medium or hard", () => {
  assert.equal(normalizeQuestionDifficulty("Easy"), "easy");
  assert.equal(normalizeQuestionDifficulty("medium"), "medium");
  assert.equal(normalizeQuestionDifficulty("Easy-Medium"), "medium");
  assert.equal(normalizeQuestionDifficulty("Hard"), "hard");
});

test("normalizeQuestion removes section and lowercases difficulty", () => {
  const normalized = normalizeQuestion({
    id: 7,
    title: "Example",
    section: "B",
    topic: "Arrays",
    difficulty: "Easy-Medium",
    maxScore: 100,
  });

  assert.equal("section" in normalized, false);
  assert.equal(normalized.difficulty, "medium");
  assert.equal(normalized.topic, "Arrays");
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
  console.log(`Passed ${tests.length} question catalog tests.`);
}
