import {
  STORE_NAMES,
  createBrowserRepositoryStorage,
} from "../storage/repositoryStorage.js";

function nowIso(timestamp = Date.now()) {
  return new Date(timestamp).toISOString();
}

function buildSummary() {
  return {
    totalScore: 0,
    maxScore: 0,
    totalPassed: 0,
    totalCases: 0,
    submittedCount: 0,
  };
}

function createExamSessionRecord(input) {
  const createdAt = input.createdAt || nowIso();

  return {
    id: crypto.randomUUID(),
    schemaVersion: 1,
    mode: "exam",
    assessment: {
      blueprintId: input.blueprintId,
      title: input.title,
      language: input.language,
      durationSeconds: input.durationSeconds,
      questionIds: input.questionIds,
      questionCount: input.questionIds.length,
    },
    entry: input.entry,
    policy: input.policy,
    lifecycle: {
      status: "active",
      createdAt,
      startedAt: createdAt,
      finishedAt: null,
      finishReason: null,
      lastSavedAt: createdAt,
    },
    navigation: {
      currentQuestionIndex: 0,
    },
    workspace: {
      draftsByQuestionId: {},
      submissionsByQuestionId: {},
    },
    integrity: {
      violations: [],
    },
    summary: buildSummary(),
  };
}

function isFinalStatus(status) {
  return (
    status === "completed" ||
    status === "time-limit" ||
    status === "integrity-limit"
  );
}

export function createExamSessionRepository({
  storage = createBrowserRepositoryStorage(),
} = {}) {
  return {
    async create(input) {
      const record = createExamSessionRecord(input);
      await storage.put(STORE_NAMES.examSessions, record);
      return record;
    },

    async getById(sessionId) {
      return storage.get(STORE_NAMES.examSessions, sessionId);
    },

    async save(record) {
      await storage.put(STORE_NAMES.examSessions, record);
      return record;
    },

    async complete(sessionId, finishReason, finishedAt = nowIso()) {
      const existingRecord = await storage.get(STORE_NAMES.examSessions, sessionId);

      if (!existingRecord) {
        return null;
      }

      const nextRecord = {
        ...existingRecord,
        lifecycle: {
          ...existingRecord.lifecycle,
          status: finishReason,
          finishedAt,
          finishReason,
          lastSavedAt: finishedAt,
        },
      };

      await storage.put(STORE_NAMES.examSessions, nextRecord);
      return nextRecord;
    },

    async listCompleted() {
      const records = await storage.getAll(STORE_NAMES.examSessions);
      return records
        .filter((record) => isFinalStatus(record.lifecycle.status))
        .sort((left, right) => {
          const leftTimestamp = new Date(left.lifecycle.finishedAt || 0).getTime();
          const rightTimestamp = new Date(right.lifecycle.finishedAt || 0).getTime();
          return rightTimestamp - leftTimestamp;
        });
    },

    async getLatestActive() {
      const records = await storage.getAll(STORE_NAMES.examSessions);
      return records
        .filter((record) => !isFinalStatus(record.lifecycle.status))
        .sort((left, right) => {
          const leftTimestamp = new Date(left.lifecycle.createdAt).getTime();
          const rightTimestamp = new Date(right.lifecycle.createdAt).getTime();
          return rightTimestamp - leftTimestamp;
        })[0] || null;
    },

    async remove(sessionId) {
      await storage.delete(STORE_NAMES.examSessions, sessionId);
    },
  };
}

export const examSessionRepository = createExamSessionRepository();
