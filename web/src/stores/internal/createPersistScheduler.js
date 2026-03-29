export function createPersistScheduler({
  get,
  set,
  persistRecord,
  selectRecord,
  mergePersistedRecord,
  debounceMs = 150,
}) {
  let timerId = null;
  let pendingPromise = null;
  let pendingResolve = null;

  const clearPendingTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  const flushPendingPersistence = async () => {
    clearPendingTimer();

    const record = selectRecord(get());
    if (!record) {
      if (pendingResolve) {
        pendingResolve();
        pendingPromise = null;
        pendingResolve = null;
      }
      return null;
    }

    const persisted = await persistRecord(record);
    set((state) => mergePersistedRecord(state, persisted));

    if (pendingResolve) {
      pendingResolve(persisted);
      pendingPromise = null;
      pendingResolve = null;
    }

    return persisted;
  };

  const schedulePersistence = () => {
    clearPendingTimer();

    if (!pendingPromise) {
      pendingPromise = new Promise((resolve) => {
        pendingResolve = resolve;
      });
    }

    timerId = setTimeout(() => {
      flushPendingPersistence().catch(() => {});
    }, debounceMs);

    return pendingPromise;
  };

  return {
    flushPendingPersistence,
    schedulePersistence,
  };
}
