import assert from "node:assert/strict";

import { createPracticeWorkspaceRepository } from "../src/lib/repositories/practiceWorkspaceRepository.js";
import { createInMemoryRepositoryStorage } from "../src/lib/storage/repositoryStorage.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("get returns null before any practice workspace is saved", async () => {
  const repository = createPracticeWorkspaceRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  const result = await repository.get();
  assert.equal(result, null);
});

test("save and get persist the current practice workspace aggregate", async () => {
  const repository = createPracticeWorkspaceRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  const record = {
    id: "default",
    schemaVersion: 2,
    mode: "practice",
    lifecycle: {
      createdAt: "2026-03-29T09:00:00.000Z",
      lastOpenedAt: "2026-03-29T09:05:00.000Z",
      lastSavedAt: "2026-03-29T09:05:00.000Z",
    },
    navigation: {
      currentQuestionId: 7,
    },
    workspace: {
      draftsByQuestionId: {
        7: {
          code: "print('practice')",
          language: "python",
          updatedAt: "2026-03-29T09:05:00.000Z",
        },
      },
      submissionsByQuestionId: {},
    },
    summary: {
      totalScore: 0,
      maxScore: 5000,
      attemptedCount: 0,
      solvedCount: 0,
      draftCount: 1,
    },
  };

  await repository.save(record);
  const loaded = await repository.get();

  assert.deepEqual(loaded, record);
});

test("clear removes the saved practice workspace", async () => {
  const repository = createPracticeWorkspaceRepository({
    storage: createInMemoryRepositoryStorage(),
  });

  await repository.save({
    id: "default",
    schemaVersion: 2,
    mode: "practice",
    lifecycle: {
      createdAt: "2026-03-29T09:00:00.000Z",
      lastOpenedAt: "2026-03-29T09:05:00.000Z",
      lastSavedAt: "2026-03-29T09:05:00.000Z",
    },
    navigation: {
      currentQuestionId: 1,
    },
    workspace: {
      draftsByQuestionId: {},
      submissionsByQuestionId: {},
    },
    summary: {
      totalScore: 0,
      maxScore: 5000,
      attemptedCount: 0,
      solvedCount: 0,
      draftCount: 0,
    },
  });

  await repository.clear();

  const loaded = await repository.get();
  assert.equal(loaded, null);
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
  console.log(`Passed ${tests.length} practice workspace repository tests.`);
}
