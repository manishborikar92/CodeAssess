export function getSessionQuestions(
  session,
  resolveQuestion
) {
  const questionIds = session?.assessment?.questionIds || [];

  return questionIds
    .map((questionId) => resolveQuestion?.(questionId) || null)
    .filter(Boolean);
}
