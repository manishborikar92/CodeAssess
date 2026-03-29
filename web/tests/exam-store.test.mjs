import assert from "node:assert/strict";

import { createExamStore } from "../src/stores/examStore.js";
import { questionRepository } from "../src/lib/repositories/questionRepository.js";
import { createExamSessionRepository } from "../src/lib/repositories/examSessionRepository.js";
import { createInMemoryRepositoryStorage } from "../src/lib/storage/repositoryStorage.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function createStore() {
  const storage = createInMemoryRepositoryStorage();
  const sessionRepository = createExamSessionRepository({ storage });

  return {
    sessionRepository,
    store: createExamStore({
      questions: questionRepository.listQuestions(),
      blueprint: questionRepository.getDefaultExamBlueprint(),
      sessionRepository,
    }),
  };
}

test("startDirectSession creates and loads a new active exam session", async () => {
  const { sessionRepository, store } = createStore();

  const session = await store.getState().startDirectSession("2026-03-29T09:00:00.000Z");

  assert.equal(store.getState().activeSession?.id, session.id);
  assert.equal(store.getState().activeSession?.entry.type, "direct");
  assert.equal(store.getState().selectedQuestions.length, 2);

  const persisted = await sessionRepository.getById(session.id);
  assert.equal(persisted?.id, session.id);

  const timer = store.getState().getTimerState(Date.parse("2026-03-29T09:15:00.000Z"));
  assert.equal(timer.isRunning, true);
  assert.equal(timer.elapsedSeconds, 15 * 60);
  assert.equal(timer.remainingSeconds, 75 * 60);
});

test("hydrateSession marks missing sessions and loads final sessions for results routing", async () => {
  const { sessionRepository, store } = createStore();

  await store.getState().hydrateSession("missing-session");
  assert.equal(store.getState().hydrationStatus, "missing");

  const session = await sessionRepository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [1, 2],
    language: "python",
    policy: questionRepository.getDefaultExamBlueprint().integrityPolicy,
    entry: {
      type: "direct",
      joinToken: null,
      invitationId: null,
    },
    createdAt: "2026-03-29T09:00:00.000Z",
  });
  await sessionRepository.complete(
    session.id,
    "completed",
    "2026-03-29T10:30:00.000Z"
  );

  await store.getState().hydrateSession(session.id);

  assert.equal(store.getState().hydrationStatus, "ready");
  assert.equal(store.getState().activeSession?.lifecycle.status, "completed");
});

test("hydrateSession keeps the exam timer running for a persisted active session", async () => {
  const { sessionRepository, store } = createStore();

  const session = await sessionRepository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [1, 2],
    language: "python",
    policy: questionRepository.getDefaultExamBlueprint().integrityPolicy,
    entry: {
      type: "direct",
      joinToken: null,
      invitationId: null,
    },
    createdAt: "2026-03-29T09:00:00.000Z",
  });

  await store.getState().hydrateSession(session.id);

  const timer = store.getState().getTimerState(Date.parse("2026-03-29T09:20:00.000Z"));
  assert.equal(timer.isRunning, true);
  assert.equal(timer.elapsedSeconds, 20 * 60);
  assert.equal(timer.remainingSeconds, 70 * 60);
});

test("recordSubmission updates summary totals and persists immediately", async () => {
  const { sessionRepository, store } = createStore();

  const session = await store.getState().startDirectSession("2026-03-29T09:00:00.000Z");
  const question = store.getState().selectedQuestions[0];

  await store.getState().recordSubmission(
    question.id,
    "print('ok')",
    { passed: 2, total: 2, score: question.maxScore },
    "2026-03-29T09:10:00.000Z"
  );

  const persisted = await sessionRepository.getById(session.id);
  assert.equal(store.getState().activeSession.summary.totalScore, question.maxScore);
  assert.equal(persisted?.summary.totalScore, question.maxScore);
  assert.equal(persisted?.summary.submittedCount, 1);
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
  console.log(`Passed ${tests.length} exam store tests.`);
}
