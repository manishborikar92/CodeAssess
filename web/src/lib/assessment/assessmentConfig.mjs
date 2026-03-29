import {
  EXAM_DURATION_SECONDS,
  EXAM_MODE,
  EXAM_VIOLATION_LIMIT,
} from "../session/examSession.mjs";
import {
  PRACTICE_MODE,
  PRACTICE_SESSION_VERSION,
} from "../session/practiceSession.mjs";

export const EXAM_QUESTION_COUNT = 2;

function getTotalScore(questions) {
  return questions.reduce((sum, question) => sum + (question.maxScore || 0), 0);
}

function getRandomOffset(maxExclusive) {
  if (maxExclusive <= 1) {
    return 0;
  }

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const maxUint32 = 0x100000000;
    const unbiasedLimit = maxUint32 - (maxUint32 % maxExclusive);
    const values = new Uint32Array(1);

    do {
      globalThis.crypto.getRandomValues(values);
    } while (values[0] >= unbiasedLimit);

    return values[0] % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

export function getOrderedQuestionSubset(questions, questionIds) {
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  return questionIds
    .map((questionId) => questionsById.get(questionId))
    .filter(Boolean);
}

export function selectRandomQuestionSubset(
  questions,
  count,
  randomOffset = getRandomOffset
) {
  const shuffledQuestions = [...questions];
  const selectionCount = Math.max(
    0,
    Math.min(Number.isInteger(count) ? count : 0, shuffledQuestions.length)
  );

  for (let index = 0; index < selectionCount; index += 1) {
    const remainingCount = shuffledQuestions.length - index;
    const offset = Math.max(
      0,
      Math.min(remainingCount - 1, Math.floor(randomOffset(remainingCount)))
    );
    const swapIndex = index + offset;

    [shuffledQuestions[index], shuffledQuestions[swapIndex]] = [
      shuffledQuestions[swapIndex],
      shuffledQuestions[index],
    ];
  }

  return shuffledQuestions.slice(0, selectionCount);
}

export function buildPracticeConfig(questions) {
  return {
    mode: PRACTICE_MODE,
    sessionVersion: PRACTICE_SESSION_VERSION,
    title: "Coding Practice Workspace",
    subtitle: "Solve any question in any order",
    totalQuestions: questions.length,
    totalScore: getTotalScore(questions),
    language: "Python 3",
  };
}

export function buildExamConfig(questions) {
  const totalQuestions = Math.min(EXAM_QUESTION_COUNT, questions.length);

  return {
    mode: EXAM_MODE,
    title: "Python Screening Assessment",
    subtitle: "Secure coding session with randomly assigned questions revealed at start",
    durationMinutes: EXAM_DURATION_SECONDS / 60,
    totalQuestions,
    questionSelection: {
      count: totalQuestions,
      hiddenUntilStart: true,
      mode: "random",
    },
    language: "Python 3",
    integrityPolicy: {
      requireFullscreen: true,
      detectTabSwitch: true,
      blockClipboard: true,
      blockContextMenu: true,
      warnBeforeUnload: true,
      maxViolations: EXAM_VIOLATION_LIMIT,
    },
  };
}
