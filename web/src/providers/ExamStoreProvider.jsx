"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";

import { examSessionRepository } from "../lib/repositories/examSessionRepository.js";
import { createExamStore } from "../stores/examStore.js";

const ExamStoreContext = createContext(null);

export function ExamStoreProvider({
  blueprint,
  children,
  questions,
}) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = createExamStore({
      questions,
      blueprint,
      sessionRepository: examSessionRepository,
    });
  }

  useEffect(() => {
    storeRef.current.getState().loadLatestActiveSession().catch(() => {});
  }, []);

  return (
    <ExamStoreContext.Provider value={storeRef.current}>
      {children}
    </ExamStoreContext.Provider>
  );
}

export function useExamStore(selector) {
  const store = useContext(ExamStoreContext);

  if (!store) {
    throw new Error("useExamStore must be used within an ExamStoreProvider.");
  }

  return useStore(store, selector);
}

export function useExamStoreApi() {
  const store = useContext(ExamStoreContext);

  if (!store) {
    throw new Error("useExamStoreApi must be used within an ExamStoreProvider.");
  }

  return store;
}
