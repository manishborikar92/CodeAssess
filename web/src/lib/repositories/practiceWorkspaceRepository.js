import {
  STORE_NAMES,
  createBrowserRepositoryStorage,
} from "../storage/repositoryStorage.js";

const PRACTICE_WORKSPACE_ID = "default";

export function createPracticeWorkspaceRepository({
  storage = createBrowserRepositoryStorage(),
} = {}) {
  return {
    async get() {
      return storage.get(STORE_NAMES.practiceWorkspaces, PRACTICE_WORKSPACE_ID);
    },

    async save(record) {
      const normalizedRecord =
        record.id === PRACTICE_WORKSPACE_ID
          ? record
          : {
              ...record,
              id: PRACTICE_WORKSPACE_ID,
            };

      await storage.put(STORE_NAMES.practiceWorkspaces, normalizedRecord);
      return normalizedRecord;
    },

    async clear() {
      await storage.delete(STORE_NAMES.practiceWorkspaces, PRACTICE_WORKSPACE_ID);
    },
  };
}

export const practiceWorkspaceRepository = createPracticeWorkspaceRepository();
