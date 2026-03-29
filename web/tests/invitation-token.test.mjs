import assert from "node:assert/strict";

import {
  SAMPLE_INVITATION_TOKEN,
  createExamAccessRepository,
} from "../src/lib/repositories/examAccessRepository.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("resolveToken verifies a valid invitation token and returns blueprint access data", async () => {
  const repository = createExamAccessRepository();

  const result = await repository.resolveToken(
    SAMPLE_INVITATION_TOKEN,
    "2026-03-29T00:00:00.000Z"
  );

  assert.equal(result.blueprint.id, "python-screening-v1");
  assert.equal(result.invitation.id, "invite-demo-001");
  assert.equal(result.invitation.token, SAMPLE_INVITATION_TOKEN);
  assert.equal(result.invitation.entryType, "join");
});

test("resolveToken rejects malformed invitation tokens", async () => {
  const repository = createExamAccessRepository();

  await assert.rejects(
    repository.resolveToken("invalid-token", "2026-03-29T00:00:00.000Z"),
    /Invalid invitation token/
  );
});

test("resolveToken rejects expired invitation tokens", async () => {
  const repository = createExamAccessRepository();

  await assert.rejects(
    repository.resolveToken(
      SAMPLE_INVITATION_TOKEN,
      "2036-01-01T00:00:00.000Z"
    ),
    /Invitation token has expired/
  );
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
  console.log(`Passed ${tests.length} invitation token tests.`);
}
