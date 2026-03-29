"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as Judge from "@/lib/execution/pyodideJudge.js";

/**
 * Hook to manage Pyodide WebAssembly runtime lifecycle.
 * Handles loading, readiness, and code execution.
 */
export function usePyodide() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const initStarted = useRef(false);

  const initialize = useCallback(async () => {
    if (initStarted.current) return;
    initStarted.current = true;
    setIsLoading(true);
    setError(null);

    try {
      await Judge.loadPyodide();
      setIsReady(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runSampleCases = useCallback(async (code, question, onProgress) => {
    return Judge.runSampleCases(code, question, onProgress);
  }, []);

  const runAllCases = useCallback(async (code, question, onProgress) => {
    return Judge.runAllCases(code, question, onProgress);
  }, []);

  const runCustomInput = useCallback(async (code, input) => {
    const result = await Judge.runSampleCases(
      code,
      { sampleCases: [{ input, output: "" }] },
      null
    );
    return result.results[0];
  }, []);

  return {
    isReady,
    isLoading,
    error,
    initialize,
    runSampleCases,
    runAllCases,
    runCustomInput,
  };
}
