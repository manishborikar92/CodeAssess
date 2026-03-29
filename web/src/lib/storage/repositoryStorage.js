const DATABASE_NAME = "codeassess";
const DATABASE_VERSION = 1;

export const STORE_NAMES = {
  examSessions: "examSessions",
  practiceWorkspaces: "practiceWorkspaces",
};

function isIndexedDbAvailable() {
  return typeof indexedDB !== "undefined";
}

function openDatabase() {
  if (!isIndexedDbAvailable()) {
    return Promise.reject(new Error("IndexedDB is unavailable in this environment."));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.addEventListener("upgradeneeded", () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAMES.examSessions)) {
        database.createObjectStore(STORE_NAMES.examSessions, {
          keyPath: "id",
        });
      }

      if (!database.objectStoreNames.contains(STORE_NAMES.practiceWorkspaces)) {
        database.createObjectStore(STORE_NAMES.practiceWorkspaces, {
          keyPath: "id",
        });
      }
    });

    request.addEventListener("success", () => {
      resolve(request.result);
    });

    request.addEventListener("error", () => {
      reject(request.error || new Error("Failed to open the browser database."));
    });
  });
}

async function withStore(storeName, mode, handler) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    transaction.addEventListener("complete", () => {
      resolve(handler.result);
    });

    transaction.addEventListener("error", () => {
      reject(transaction.error || new Error("Repository transaction failed."));
    });

    transaction.addEventListener("abort", () => {
      reject(transaction.error || new Error("Repository transaction was aborted."));
    });

    handler(store, {
      resolve(value) {
        handler.result = value;
      },
      reject(error) {
        reject(error);
      },
    });
  });
}

export function createBrowserRepositoryStorage() {
  return {
    async get(storeName, key) {
      return withStore(storeName, "readonly", (store, transaction) => {
        const request = store.get(key);
        request.addEventListener("success", () => {
          transaction.resolve(request.result ?? null);
        });
        request.addEventListener("error", () => {
          transaction.reject(request.error || new Error("Failed to read a record."));
        });
      });
    },

    async put(storeName, value) {
      return withStore(storeName, "readwrite", (store, transaction) => {
        const request = store.put(value);
        request.addEventListener("success", () => {
          transaction.resolve(value);
        });
        request.addEventListener("error", () => {
          transaction.reject(request.error || new Error("Failed to save a record."));
        });
      });
    },

    async getAll(storeName) {
      return withStore(storeName, "readonly", (store, transaction) => {
        const request = store.getAll();
        request.addEventListener("success", () => {
          transaction.resolve(request.result ?? []);
        });
        request.addEventListener("error", () => {
          transaction.reject(request.error || new Error("Failed to read records."));
        });
      });
    },

    async delete(storeName, key) {
      return withStore(storeName, "readwrite", (store, transaction) => {
        const request = store.delete(key);
        request.addEventListener("success", () => {
          transaction.resolve();
        });
        request.addEventListener("error", () => {
          transaction.reject(request.error || new Error("Failed to delete a record."));
        });
      });
    },
  };
}

export function createInMemoryRepositoryStorage(initialState = {}) {
  const stores = new Map(
    Object.values(STORE_NAMES).map((storeName) => [
      storeName,
      new Map(
        Array.isArray(initialState[storeName])
          ? initialState[storeName].map((value) => [value.id, structuredClone(value)])
          : []
      ),
    ])
  );

  const getStore = (storeName) => {
    if (!stores.has(storeName)) {
      stores.set(storeName, new Map());
    }

    return stores.get(storeName);
  };

  return {
    async get(storeName, key) {
      const store = getStore(storeName);
      return store.has(key) ? structuredClone(store.get(key)) : null;
    },

    async put(storeName, value) {
      const store = getStore(storeName);
      store.set(value.id, structuredClone(value));
      return structuredClone(value);
    },

    async getAll(storeName) {
      return Array.from(getStore(storeName).values()).map((value) =>
        structuredClone(value)
      );
    },

    async delete(storeName, key) {
      getStore(storeName).delete(key);
    },
  };
}
