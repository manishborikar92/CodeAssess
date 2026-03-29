import assert from "node:assert/strict";

import { getSessionQuestions } from "../src/lib/session/resultsSession.js";
import { questionRepository } from "../src/lib/repositories/questionRepository.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("getSessionQuestions returns only the questions assigned to the exam session", () => {
  const session = {
    assessment: {
      questionIds: [3, 1],
    },
  };

  const questions = getSessionQuestions(session, (questionId) =>
    questionRepository.getQuestionById(questionId)
  );

  assert.deepEqual(
    questions.map((question) => question.id),
    [3, 1]
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
  console.log(`Passed ${tests.length} results session tests.`);
}
