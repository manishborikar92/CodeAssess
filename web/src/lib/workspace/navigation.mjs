export function clampQuestionIndex(index, questionCount) {
  if (!Number.isInteger(index) || questionCount < 1) {
    return null;
  }

  return Math.max(0, Math.min(questionCount - 1, index));
}

export function getPreviousQuestionIndex(currentIndex, questionCount) {
  if (questionCount < 1 || currentIndex <= 0) {
    return 0;
  }

  return Math.max(0, currentIndex - 1);
}

export function getNextQuestionIndex(currentIndex, questionCount) {
  if (questionCount < 1) {
    return 0;
  }

  return Math.min(questionCount - 1, currentIndex + 1);
}

export function getRandomQuestionIndex(
  currentIndex,
  questionCount,
  randomNumber = Math.random
) {
  if (questionCount <= 1) {
    return 0;
  }

  const candidateIndexes = Array.from({ length: questionCount }, (_, index) => index).filter(
    (index) => index !== currentIndex
  );
  const selectedIndex = Math.floor(randomNumber() * candidateIndexes.length);

  return candidateIndexes[selectedIndex];
}
