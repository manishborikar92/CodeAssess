"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Toast, { showToast } from "@/components/ui/Toast";

const SIDEBAR_CLOSE_ANIMATION_MS = 250;

const PYODIDE_TOAST = {
  loading: {
    message: "Loading Python runtime. This may take a moment.",
    variant: "default",
    duration: 5000,
  },
  ready: {
    message: "Python runtime ready.",
    variant: "success",
    duration: 2500,
  },
};

export function WorkspaceToastHost() {
  return <Toast />;
}

export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearCloseTimer();
    setIsClosing(false);
    setIsOpen(true);
  }, [clearCloseTimer]);

  const close = useCallback(() => {
    if (!isOpen && !isClosing) {
      return;
    }

    clearCloseTimer();
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, SIDEBAR_CLOSE_ANIMATION_MS);
  }, [clearCloseTimer, isClosing, isOpen]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [close, isOpen, open]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  return { isOpen, isClosing, open, close, toggle };
}

export function useDialogState(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
}

export function usePyodideInitializer(pyodide, isWorkspaceLoading) {
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const initializeRef = useRef(pyodide.initialize);

  useEffect(() => {
    initializeRef.current = pyodide.initialize;
  }, [pyodide.initialize]);

  useEffect(() => {
    if (isWorkspaceLoading) {
      return undefined;
    }

    let cancelled = false;

    (async () => {
      showToast(
        PYODIDE_TOAST.loading.message,
        PYODIDE_TOAST.loading.variant,
        PYODIDE_TOAST.loading.duration
      );

      await initializeRef.current();

      if (!cancelled) {
        showToast(
          PYODIDE_TOAST.ready.message,
          PYODIDE_TOAST.ready.variant,
          PYODIDE_TOAST.ready.duration
        );
        setIsPyodideLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isWorkspaceLoading]);

  return { isPyodideLoading };
}

export function useWorkspaceCodeEditor({ currentQuestion, getDraft, saveDraft }) {
  const [questionResults, setQuestionResults] = useState({});
  const currentQuestionId = currentQuestion?.id ?? null;

  const code =
    currentQuestion && currentQuestionId !== null
      ? getDraft(currentQuestionId, currentQuestion.starterCode)
      : "";
  const results =
    currentQuestionId !== null
      ? questionResults[currentQuestionId]?.results || null
      : null;
  const resultMode =
    currentQuestionId !== null
      ? questionResults[currentQuestionId]?.resultMode || null
      : null;

  const setResults = useCallback(
    (nextResults) => {
      if (currentQuestionId === null) {
        return;
      }

      setQuestionResults((previous) => ({
        ...previous,
        [currentQuestionId]: {
          ...previous[currentQuestionId],
          results: nextResults,
        },
      }));
    },
    [currentQuestionId]
  );

  const setResultMode = useCallback(
    (nextResultMode) => {
      if (currentQuestionId === null) {
        return;
      }

      setQuestionResults((previous) => ({
        ...previous,
        [currentQuestionId]: {
          ...previous[currentQuestionId],
          resultMode: nextResultMode,
        },
      }));
    },
    [currentQuestionId]
  );

  const handleCodeChange = useCallback(
    (nextCode) => {
      if (currentQuestion && currentQuestionId !== null) {
        saveDraft(currentQuestionId, nextCode);
      }
    },
    [currentQuestion, currentQuestionId, saveDraft]
  );

  const resetToStarter = useCallback(() => {
    if (!currentQuestion || currentQuestionId === null) {
      return;
    }

    saveDraft(currentQuestionId, currentQuestion.starterCode);
  }, [currentQuestion, currentQuestionId, saveDraft]);

  return {
    code,
    results,
    setResults,
    resultMode,
    setResultMode,
    handleCodeChange,
    resetToStarter,
  };
}

export function useWorkspaceExecution({
  code,
  currentQuestion,
  disableReason,
  formatSubmissionToast,
  isInteractionDisabled,
  pyodide,
  setResultMode,
  setResults,
  onSuccessfulSubmission,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [runningMode, setRunningMode] = useState(null);

  const execute = useCallback(
    async (mode, fn) => {
      if (!currentQuestion || isRunning) {
        return;
      }

      if (isInteractionDisabled) {
        showToast(disableReason, "error", 3500);
        return;
      }

      setIsRunning(true);
      setRunningMode(mode);

      try {
        await fn();
      } finally {
        setIsRunning(false);
        setRunningMode(null);
      }
    },
    [currentQuestion, disableReason, isInteractionDisabled, isRunning]
  );

  const handleRun = useCallback(
    () =>
      execute("run", async () => {
        try {
          const result = await pyodide.runSampleCases(code, currentQuestion);
          setResults(result);
          setResultMode("run");
        } catch (error) {
          showToast(`Execution error: ${error.message}`, "error");
        }
      }),
    [code, currentQuestion, execute, pyodide, setResultMode, setResults]
  );

  const handleSubmit = useCallback(
    () =>
      execute("submit", async () => {
        try {
          const result = await pyodide.runAllCases(code, currentQuestion);
          setResults(result);
          setResultMode("submit");
          onSuccessfulSubmission?.({
            code,
            questionId: currentQuestion.id,
            result,
          });

          const toastPayload = formatSubmissionToast?.({
            currentQuestion,
            result,
          });

          if (toastPayload?.message) {
            showToast(
              toastPayload.message,
              toastPayload.variant || "default",
              toastPayload.duration
            );
          }
        } catch (error) {
          showToast(`Submission error: ${error.message}`, "error");
        }
      }),
    [
      code,
      currentQuestion,
      execute,
      formatSubmissionToast,
      onSuccessfulSubmission,
      pyodide,
      setResultMode,
      setResults,
    ]
  );

  const handleRunCustom = useCallback(
    async (input) => {
      if (!currentQuestion) {
        return { error: "Choose a question before running custom input." };
      }

      if (isInteractionDisabled) {
        return { error: disableReason };
      }

      return pyodide.runCustomInput(code, input);
    },
    [code, currentQuestion, disableReason, isInteractionDisabled, pyodide]
  );

  return { isRunning, runningMode, handleRun, handleSubmit, handleRunCustom };
}
