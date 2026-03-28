import {
  EXAM_DURATION_SECONDS,
  EXAM_MODE,
  EXAM_VIOLATION_LIMIT,
} from "./examSession.mjs";
import {
  PRACTICE_MODE,
  PRACTICE_SESSION_VERSION,
  QUESTION_TIME_LIMIT_SECONDS,
} from "./practiceSession.mjs";

export const EXAM_QUESTION_COUNT = 2;

function getTotalScore(questions) {
  return questions.reduce((sum, question) => sum + (question.maxScore || 0), 0);
}

export function getOrderedQuestionSubset(questions, questionIds) {
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  return questionIds
    .map((questionId) => questionsById.get(questionId))
    .filter(Boolean);
}

export function buildPracticeConfig(questions) {
  return {
    mode: PRACTICE_MODE,
    sessionVersion: PRACTICE_SESSION_VERSION,
    title: "Coding Practice Workspace",
    subtitle: "Solve any question in any order",
    totalQuestions: questions.length,
    questionTimeLimitMinutes: QUESTION_TIME_LIMIT_SECONDS / 60,
    totalScore: getTotalScore(questions),
    language: "Python 3",
  };
}

export function buildExamConfig(questions) {
  const questionIds = questions
    .slice(0, EXAM_QUESTION_COUNT)
    .map((question) => question.id);
  const examQuestions = getOrderedQuestionSubset(questions, questionIds);

  return {
    mode: EXAM_MODE,
    title: "Frontend Screening Assessment",
    subtitle: "Secure coding session with timed question switching",
    durationMinutes: EXAM_DURATION_SECONDS / 60,
    totalQuestions: examQuestions.length,
    questionIds,
    totalScore: getTotalScore(examQuestions),
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
