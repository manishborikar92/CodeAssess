import questionsData from "../../data/questions.json" with { type: "json" };
import {
  DEFAULT_EXAM_BLUEPRINT_ID,
  EXAM_BLUEPRINTS,
} from "../../data/exam/blueprints.js";
import { normalizeQuestions } from "../questions/questionCatalog.mjs";

const normalizedQuestions = normalizeQuestions(questionsData);
const questionsById = new Map(
  normalizedQuestions.map((question) => [question.id, question])
);
const blueprintsById = new Map(
  EXAM_BLUEPRINTS.map((blueprint) => [blueprint.id, blueprint])
);

export function createQuestionRepository() {
  return {
    listQuestions() {
      return normalizedQuestions;
    },

    getQuestionById(questionId) {
      const normalizedId = Number(questionId);
      return questionsById.get(normalizedId) || null;
    },

    listExamBlueprints() {
      return EXAM_BLUEPRINTS;
    },

    getExamBlueprintById(blueprintId) {
      return blueprintsById.get(blueprintId) || null;
    },

    getDefaultExamBlueprint() {
      return blueprintsById.get(DEFAULT_EXAM_BLUEPRINT_ID) || null;
    },
  };
}

export const questionRepository = createQuestionRepository();
