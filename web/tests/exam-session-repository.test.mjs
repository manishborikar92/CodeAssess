import assert from "node:assert/strict";

import { createExamSessionRepository } from "../src/lib/repositories/examSessionRepository.js";
import { createInMemoryRepositoryStorage } from "../src/lib/storage/repositoryStorage.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function createPolicy() {
  return {
    requireFullscreen: true,
    detectTabSwitch: true,
    blockClipboard: true,
    blockContextMenu: true,
    warnBeforeUnload: true,
    maxViolations: 3,
  };
}

test("create persists a new active exam session", async () => {
  const repository = createExamSessionRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  const record = await repository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [3, 8],
    language: "python",
    policy: createPolicy(),
    entry: {
      type: "direct",
      joinToken: null,
      invitationId: null,
    },
    createdAt: "2026-03-29T09:00:00.000Z",
  });

  assert.equal(record.lifecycle.status, "active");
  assert.equal(record.assessment.questionCount, 2);
  assert.deepEqual(record.assessment.questionIds, [3, 8]);

  const loaded = await repository.getById(record.id);
  assert.deepEqual(loaded, record);
});

test("save replaces the full exam session aggregate and updates lastSavedAt", async () => {
  const repository = createExamSessionRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  const record = await repository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [1, 2],
    language: "python",
    policy: createPolicy(),
    entry: {
      type: "direct",
      joinToken: null,
      invitationId: null,
    },
    createdAt: "2026-03-29T09:00:00.000Z",
  });

  const saved = await repository.save({
    ...record,
    navigation: {
      currentQuestionIndex: 1,
    },
    workspace: {
      ...record.workspace,
      draftsByQuestionId: {
        2: {
          code: "print('hello')",
          language: "python",
          updatedAt: "2026-03-29T09:05:00.000Z",
        },
      },
    },
    lifecycle: {
      ...record.lifecycle,
      lastSavedAt: "2026-03-29T09:05:00.000Z",
    },
  });

  assert.equal(saved.navigation.currentQuestionIndex, 1);
  assert.equal(saved.workspace.draftsByQuestionId[2].code, "print('hello')");
  assert.equal(saved.lifecycle.lastSavedAt, "2026-03-29T09:05:00.000Z");
});

test("complete finalizes a session and listCompleted returns final sessions newest first", async () => {
  const repository = createExamSessionRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  const first = await repository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [1, 2],
    language: "python",
    policy: createPolicy(),
    entry: {
      type: "direct",
      joinToken: null,
      invitationId: null,
    },
    createdAt: "2026-03-29T09:00:00.000Z",
  });
  const second = await repository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [3, 4],
    language: "python",
    policy: createPolicy(),
    entry: {
      type: "join",
      joinToken: "token",
      invitationId: "invite-demo-001",
    },
    createdAt: "2026-03-29T10:00:00.000Z",
  });

  await repository.complete(first.id, "completed", "2026-03-29T10:30:00.000Z");
  await repository.complete(second.id, "time-limit", "2026-03-29T11:45:00.000Z");

  const results = await repository.listCompleted();
  assert.deepEqual(
    results.map((item) => [item.id, item.lifecycle.status]),
    [
      [second.id, "time-limit"],
      [first.id, "completed"],
    ]
  );
});

test("getLatestActive returns the newest unfinished session", async () => {
  const repository = createExamSessionRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  const first = await repository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [1, 2],
    language: "python",
    policy: createPolicy(),
    entry: {
      type: "direct",
      joinToken: null,
      invitationId: null,
    },
    createdAt: "2026-03-29T09:00:00.000Z",
  });
  const second = await repository.create({
    blueprintId: "python-screening-v1",
    title: "Python Screening Assessment",
    durationSeconds: 5400,
    questionIds: [3, 4],
    language: "python",
    policy: createPolicy(),
    entry: {
      type: "join",
      joinToken: "token",
      invitationId: "invite-demo-001",
    },
    createdAt: "2026-03-29T10:00:00.000Z",
  });

  await repository.complete(first.id, "completed", "2026-03-29T10:30:00.000Z");

  const latestActive = await repository.getLatestActive();
  assert.equal(latestActive?.id, second.id);
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
  console.log(`Passed ${tests.length} exam session repository tests.`);
}
