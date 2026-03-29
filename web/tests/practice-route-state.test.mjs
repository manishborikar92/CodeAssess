import assert from "node:assert/strict";

import { getPracticeRouteState } from "../src/components/practice/practiceRouteState.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("getPracticeRouteState returns the practice index view when there is no segment", () => {
  const routeState = getPracticeRouteState(null, () => false);

  assert.deepEqual(routeState, {
    view: "index",
    questionId: null,
  });
});

test("getPracticeRouteState recognizes the progress route", () => {
  const routeState = getPracticeRouteState("progress", () => false);

  assert.deepEqual(routeState, {
    view: "progress",
    questionId: null,
  });
});

test("getPracticeRouteState resolves a valid question route", () => {
  const routeState = getPracticeRouteState("7", (questionId) => questionId === 7);

  assert.deepEqual(routeState, {
    view: "question",
    questionId: 7,
  });
});

test("getPracticeRouteState treats unknown segments as unknown", () => {
  const routeState = getPracticeRouteState("999", () => false);

  assert.deepEqual(routeState, {
    view: "unknown",
    questionId: null,
  });
});

test("getPracticeRouteState rejects non-positive numeric segments", () => {
  const routeState = getPracticeRouteState("0", () => true);

  assert.deepEqual(routeState, {
    view: "unknown",
    questionId: null,
  });
});

let failed = false;

for (const { name, fn } of tests) {
  try {
    await fn();
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
  console.log(`Passed ${tests.length} practice route state tests.`);
}
