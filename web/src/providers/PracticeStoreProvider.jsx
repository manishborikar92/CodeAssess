"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";

import { practiceWorkspaceRepository } from "../lib/repositories/practiceWorkspaceRepository.js";
import { createPracticeStore } from "../stores/practiceStore.js";

const PracticeStoreContext = createContext(null);

export function PracticeStoreProvider({
  children,
  questions,
}) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = createPracticeStore({
      questions,
      workspaceRepository: practiceWorkspaceRepository,
    });
  }

  useEffect(() => {
    storeRef.current.getState().hydrateWorkspace().catch(() => {});
  }, []);

  return (
    <PracticeStoreContext.Provider value={storeRef.current}>
      {children}
    </PracticeStoreContext.Provider>
  );
}

export function usePracticeStore(selector) {
  const store = useContext(PracticeStoreContext);

  if (!store) {
    throw new Error(
      "usePracticeStore must be used within a PracticeStoreProvider."
    );
  }

  return useStore(store, selector);
}

export function usePracticeStoreApi() {
  const store = useContext(PracticeStoreContext);

  if (!store) {
    throw new Error(
      "usePracticeStoreApi must be used within a PracticeStoreProvider."
    );
  }

  return store;
}
