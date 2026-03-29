import { selectRandomQuestionSubset } from "../assessment/assessmentConfig.mjs";

export async function createExamSessionAttempt({
  blueprint,
  createdAt = new Date().toISOString(),
  entry,
  questions,
  sessionRepository,
}) {
  const selectedQuestions = selectRandomQuestionSubset(
    questions,
    blueprint.questionSelection.count
  );

  if (selectedQuestions.length === 0) {
    throw new Error("No exam questions are available.");
  }

  const session = await sessionRepository.create({
    blueprintId: blueprint.id,
    title: blueprint.title,
    durationSeconds: blueprint.durationSeconds,
    questionIds: selectedQuestions.map((question) => question.id),
    language: blueprint.language,
    policy: blueprint.integrityPolicy,
    entry,
    createdAt,
  });

  return {
    selectedQuestions,
    session,
  };
}
