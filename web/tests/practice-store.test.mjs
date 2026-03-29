import assert from "node:assert/strict";

import { createPracticeStore } from "../src/stores/practiceStore.js";
import { questionRepository } from "../src/lib/repositories/questionRepository.js";
import { createPracticeWorkspaceRepository } from "../src/lib/repositories/practiceWorkspaceRepository.js";
import { createInMemoryRepositoryStorage } from "../src/lib/storage/repositoryStorage.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function createStore() {
  const workspaceRepository = createPracticeWorkspaceRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  return {
    workspaceRepository,
    store: createPracticeStore({
      questions: questionRepository.listQuestions(),
      workspaceRepository,
    }),
  };
}

test("hydrateWorkspace initializes an empty practice record when nothing is persisted", async () => {
  const { store } = createStore();

  await store.getState().hydrateWorkspace("2026-03-29T09:00:00.000Z");

  assert.equal(store.getState().hydrationStatus, "ready");
  assert.equal(store.getState().workspace.id, "default");
  assert.equal(store.getState().workspace.navigation.currentQuestionId, null);
});

test("openQuestion switches the current route-owned practice question and schedules persistence", async () => {
  const { workspaceRepository, store } = createStore();

  await store.getState().hydrateWorkspace("2026-03-29T09:00:00.000Z");
  await store.getState().openQuestion(7, "2026-03-29T09:05:00.000Z");
  await store.getState().flushPendingPersistence();

  assert.equal(store.getState().workspace.navigation.currentQuestionId, 7);

  const persisted = await workspaceRepository.get();
  assert.equal(persisted?.navigation.currentQuestionId, 7);
  assert.equal("timersByQuestionId" in persisted.workspace, false);
});

test("saveDraft and recordSubmission update the workspace summary without timer state", async () => {
  const { workspaceRepository, store } = createStore();

  await store.getState().hydrateWorkspace("2026-03-29T09:00:00.000Z");
  await store.getState().openQuestion(3, "2026-03-29T09:05:00.000Z");
  await store.getState().saveDraft(3, "print('practice')", "2026-03-29T09:06:00.000Z");
  await store.getState().flushPendingPersistence();

  const question = questionRepository.getQuestionById(3);
  await store.getState().recordSubmission(
    3,
    "print('practice')",
    { passed: 2, total: 2, score: question.maxScore },
    "2026-03-29T09:07:00.000Z"
  );

  assert.equal(store.getState().workspace.summary.totalScore, question.maxScore);
  assert.equal(store.getState().workspace.summary.attemptedCount, 1);
  assert.equal(store.getState().workspace.summary.draftCount, 1);

  const persisted = await workspaceRepository.get();
  assert.equal(persisted?.summary.totalScore, question.maxScore);
  assert.equal("timersByQuestionId" in persisted.workspace, false);
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
  console.log(`Passed ${tests.length} practice store tests.`);
}
