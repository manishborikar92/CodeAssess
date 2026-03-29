export function upsertBestSubmission(
  submissions,
  { code, questionId, result },
  submittedAt = Date.now()
) {
  const existingSubmission = submissions[questionId];

  if (existingSubmission && result.score < existingSubmission.score) {
    return submissions;
  }

  return {
    ...submissions,
    [questionId]: {
      code,
      score: result.score,
      passed: result.passed,
      total: result.total,
      submittedAt: new Date(submittedAt).toISOString(),
    },
  };
}

export function sumSubmissionScores(submissions) {
  return Object.values(submissions).reduce(
    (sum, submission) => sum + (submission.score || 0),
    0
  );
}
