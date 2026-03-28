export const QUESTION_DIFFICULTIES = ["easy", "medium", "hard"];

export function normalizeQuestionDifficulty(difficulty) {
  const normalizedValue = String(difficulty || "").trim().toLowerCase();

  if (normalizedValue.includes("hard")) {
    return "hard";
  }

  if (normalizedValue.includes("medium")) {
    return "medium";
  }

  if (normalizedValue.includes("easy")) {
    return "easy";
  }

  return "medium";
}

export function formatQuestionDifficulty(difficulty) {
  const normalizedDifficulty = normalizeQuestionDifficulty(difficulty);

  return (
    normalizedDifficulty.charAt(0).toUpperCase() + normalizedDifficulty.slice(1)
  );
}

export function normalizeQuestion(question) {
  const { section, difficulty, ...rest } = question;

  return {
    ...rest,
    difficulty: normalizeQuestionDifficulty(difficulty),
  };
}

export function normalizeQuestions(questions) {
  return Array.isArray(questions) ? questions.map(normalizeQuestion) : [];
}
