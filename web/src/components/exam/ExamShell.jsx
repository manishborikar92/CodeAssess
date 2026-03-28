"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useExam } from "@/context/ExamContext";
import { usePyodide } from "@/hooks/usePyodide";
import { getQuestions } from "@/lib/api";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ProblemPanel from "./ProblemPanel";
import CodePanel from "./CodePanel";
import OutputPanel from "./OutputPanel";
import ResultsScreen from "./ResultsScreen";
import Modal from "@/components/ui/Modal";
import Toast, { showToast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";

const SIDEBAR_CLOSE_ANIMATION_MS = 250;

const TOAST = {
  pyodideLoading: {
    message: "Loading Python runtime. This may take a moment.",
    variant: "default",
    duration: 5000,
  },
  pyodideReady: {
    message: "Python runtime ready.",
    variant: "success",
    duration: 2500,
  },
};

function ResizeHandle({ orientation = "horizontal" }) {
  const isHorizontal = orientation === "horizontal";

  return (
    <Separator
      className={`relative flex items-center justify-center bg-[#0a0a0a] transition-colors z-10 ${
        isHorizontal ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-border-main
          hover:bg-border-bright transition-colors ${
            isHorizontal ? "h-6 w-1" : "w-6 h-1"
          }`}
      />
    </Separator>
  );
}

function PracticeLoadingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
      <Spinner size="lg" />
      <p className="text-text-secondary text-sm">Loading practice workspace...</p>
    </div>
  );
}

function PyodideLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[200] bg-[rgba(10,13,20,0.94)] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-[3px] border-border-main border-t-accent-cyan rounded-full animate-spin" />
      <p className="text-base font-semibold text-text-primary">Loading Python Runtime...</p>
      <p className="text-[0.8rem] text-text-muted">
        Initializing the in-browser judge engine
      </p>
    </div>
  );
}

function useSidebar() {
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

function useResetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
  };
}

function usePracticeInitializer({ loadQuestions, restoreSession }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const questions = await getQuestions();
      if (cancelled) {
        return;
      }

      loadQuestions(questions);
      restoreSession(questions.length);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadQuestions, restoreSession]);

  return { isLoading };
}

function usePyodideInitializer(pyodide, isWorkspaceLoading) {
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
        TOAST.pyodideLoading.message,
        TOAST.pyodideLoading.variant,
        TOAST.pyodideLoading.duration
      );

      await initializeRef.current();

      if (!cancelled) {
        showToast(
          TOAST.pyodideReady.message,
          TOAST.pyodideReady.variant,
          TOAST.pyodideReady.duration
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

function useCodeEditor(exam) {
  const [questionResults, setQuestionResults] = useState({});
  const currentQuestionId = exam.currentQuestion?.id ?? null;

  const code =
    exam.currentQuestion && currentQuestionId !== null
      ? exam.getDraft(currentQuestionId, exam.currentQuestion.starterCode)
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
      if (exam.currentQuestion && currentQuestionId !== null) {
        exam.saveDraft(currentQuestionId, nextCode);
      }
    },
    [currentQuestionId, exam]
  );

  const resetToStarter = useCallback(() => {
    if (!exam.currentQuestion || currentQuestionId === null) {
      return;
    }

    const starterCode = exam.currentQuestion.starterCode;
    exam.saveDraft(currentQuestionId, starterCode);
  }, [currentQuestionId, exam]);

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

function useCodeExecution({
  code,
  exam,
  pyodide,
  setResults,
  setResultMode,
  isInteractionDisabled,
  disableReason,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [runningMode, setRunningMode] = useState(null);

  const execute = useCallback(
    async (mode, fn) => {
      if (!exam.currentQuestion || isRunning) {
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
    [disableReason, exam.currentQuestion, isInteractionDisabled, isRunning]
  );

  const handleRun = useCallback(
    () =>
      execute("run", async () => {
        try {
          const result = await pyodide.runSampleCases(code, exam.currentQuestion);
          setResults(result);
          setResultMode("run");
        } catch (error) {
          showToast(`Execution error: ${error.message}`, "error");
        }
      }),
    [code, exam.currentQuestion, execute, pyodide, setResultMode, setResults]
  );

  const handleSubmit = useCallback(
    () =>
      execute("submit", async () => {
        try {
          const result = await pyodide.runAllCases(code, exam.currentQuestion);
          setResults(result);
          setResultMode("submit");
          exam.recordSubmission(exam.currentQuestion.id, code, result);

          showToast(
            `Q${exam.currentQuestion.id}: ${result.passed}/${result.total} passed | Score: ${result.score}/${exam.currentQuestion.maxScore}`,
            result.passed === result.total ? "success" : "default"
          );
        } catch (error) {
          showToast(`Submission error: ${error.message}`, "error");
        }
      }),
    [code, exam, execute, pyodide, setResultMode, setResults]
  );

  const handleRunCustom = useCallback(
    async (input) => {
      if (!exam.currentQuestion) {
        return { error: "Choose a question before running custom input." };
      }

      if (isInteractionDisabled) {
        return { error: disableReason };
      }

      return pyodide.runCustomInput(code, input);
    },
    [code, disableReason, exam.currentQuestion, isInteractionDisabled, pyodide]
  );

  return { isRunning, runningMode, handleRun, handleSubmit, handleRunCustom };
}

export default function ExamShell() {
  const exam = useExam();
  const pyodide = usePyodide();

  const sidebar = useSidebar();
  const {
    close: closeSidebar,
    isClosing: isSidebarClosing,
    isOpen: isSidebarOpen,
    open: openSidebar,
    toggle: toggleSidebar,
  } = sidebar;
  const resetModal = useResetModal();
  const {
    close: closeResetModal,
    isOpen: isResetModalOpen,
    open: openResetModal,
  } = resetModal;
  const [showResults, setShowResults] = useState(false);

  const { isLoading } = usePracticeInitializer({
    loadQuestions: exam.loadQuestions,
    restoreSession: exam.restoreSession,
  });
  const { isPyodideLoading } = usePyodideInitializer(pyodide, isLoading);

  const {
    code,
    results,
    setResults,
    resultMode,
    setResultMode,
    handleCodeChange,
    resetToStarter,
  } = useCodeEditor(exam);

  const hasSelectedQuestion = Boolean(exam.currentQuestion);
  const isQuestionExpired = Boolean(exam.currentQuestionTimer?.isExpired);

  const interactionDisabledMessage = !hasSelectedQuestion
    ? "Choose a question from the sidebar to start coding."
    : isQuestionExpired
    ? "The 30-minute limit for this question has ended. You can review your work, but editing and judging are disabled."
    : "";

  const customInputDisabledMessage = !hasSelectedQuestion
    ? "Choose a question from the sidebar before using custom input."
    : isQuestionExpired
    ? "Custom input is disabled after the question timer expires."
    : "";

  const {
    isRunning,
    runningMode,
    handleRun,
    handleSubmit,
    handleRunCustom,
  } = useCodeExecution({
    code,
    exam,
    pyodide,
    setResults,
    setResultMode,
    isInteractionDisabled: !hasSelectedQuestion || isQuestionExpired,
    disableReason: interactionDisabledMessage,
  });

  const autoOpenSidebarRef = useRef(false);
  useEffect(() => {
    if (
      isLoading ||
      autoOpenSidebarRef.current ||
      exam.questions.length === 0 ||
      exam.currentQuestion
    ) {
      return;
    }

    autoOpenSidebarRef.current = true;
    openSidebar();
  }, [exam.currentQuestion, exam.questions.length, isLoading, openSidebar]);

  const expiredQuestionToastRef = useRef(null);
  const notifyQuestionExpired = useCallback(
    (questionId) => {
      if (!questionId || expiredQuestionToastRef.current === questionId) {
        return;
      }

      expiredQuestionToastRef.current = questionId;
      exam.expireQuestion(questionId);
      openSidebar();
      showToast(
        `Q${questionId}: the 30-minute limit has ended. Choose another question to keep practicing.`,
        "error",
        5000
      );
    },
    [exam, openSidebar]
  );

  useEffect(() => {
    if (!exam.currentQuestion || !exam.currentQuestionTimer?.isExpired) {
      return;
    }

    notifyQuestionExpired(exam.currentQuestion.id);
  }, [
    exam.currentQuestion,
    exam.currentQuestionTimer?.isExpired,
    notifyQuestionExpired,
  ]);

  const handleCurrentQuestionTimeUp = useCallback(() => {
    if (exam.currentQuestion) {
      notifyQuestionExpired(exam.currentQuestion.id);
    }
  }, [exam.currentQuestion, notifyQuestionExpired]);

  const handleSelectQuestion = (index) => {
    exam.setQuestion(index);
    closeSidebar();
  };

  const handleResetConfirm = () => {
    resetToStarter();
    closeResetModal();
  };

  if (isLoading) {
    return <PracticeLoadingScreen />;
  }

  const isSidebarVisible = isSidebarOpen || isSidebarClosing;

  return (
    <>
      {isPyodideLoading && <PyodideLoadingOverlay />}

      <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
        <div className="shrink-0">
          <Header
            key={exam.currentQuestion?.id || "no-question"}
            onViewResults={() => setShowResults(true)}
            onQuestionTimeUp={handleCurrentQuestionTimeUp}
            pyodideReady={pyodide.isReady}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        <div className="flex-1 overflow-hidden p-2 min-h-0 relative">
          {isSidebarVisible && (
            <>
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-black/50 z-40 ${
                  isSidebarClosing ? "animate-fade-out" : "animate-fade-in"
                }`}
                onClick={closeSidebar}
              />
              <div
                className={`absolute left-2 top-2 bottom-2 w-[420px] z-50 rounded-lg
                  overflow-hidden bg-bg-secondary border border-border-main shadow-2xl
                  ${
                    isSidebarClosing
                      ? "animate-slide-out-left"
                      : "animate-slide-in-left"
                  }`}
              >
                <Sidebar onSelectQuestion={handleSelectQuestion} />
              </div>
            </>
          )}

          <Group orientation="horizontal" className="h-full">
            <Panel
              defaultSize={50}
              minSize={20}
              className="rounded-lg overflow-hidden bg-bg-secondary border border-border-main flex flex-col"
            >
              <ProblemPanel
                question={exam.currentQuestion}
                timer={exam.currentQuestionTimer}
              />
            </Panel>

            <ResizeHandle orientation="horizontal" />

            <Panel defaultSize={50} minSize={30}>
              <Group orientation="vertical" className="h-full">
                <Panel
                  defaultSize={65}
                  minSize={30}
                  className="rounded-lg overflow-hidden bg-bg-secondary border border-border-main flex flex-col"
                >
                  <CodePanel
                    code={code}
                    onCodeChange={handleCodeChange}
                    onRun={handleRun}
                    onSubmit={handleSubmit}
                    onReset={openResetModal}
                    isRunning={isRunning}
                    runningMode={runningMode}
                    pyodideReady={pyodide.isReady}
                    isDisabled={!hasSelectedQuestion || isQuestionExpired}
                    disabledMessage={interactionDisabledMessage}
                  />
                </Panel>

                <ResizeHandle orientation="vertical" />

                <Panel
                  defaultSize={35}
                  minSize={20}
                  className="rounded-lg overflow-hidden bg-bg-secondary border border-border-main flex flex-col"
                >
                  <OutputPanel
                    results={results}
                    mode={resultMode}
                    question={exam.currentQuestion}
                    onRunCustom={handleRunCustom}
                    isRunning={isRunning}
                    isInteractionDisabled={!hasSelectedQuestion || isQuestionExpired}
                    disableReason={customInputDisabledMessage}
                  />
                </Panel>
              </Group>
            </Panel>
          </Group>
        </div>
      </div>

      {showResults && <ResultsScreen onClose={() => setShowResults(false)} />}

      <Modal
        isOpen={isResetModalOpen}
        title="Reset Code"
        message="Reset to starter code? Your current draft for this question will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleResetConfirm}
        onCancel={closeResetModal}
      />

      <Toast />
    </>
  );
}
