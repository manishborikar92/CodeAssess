"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import { Panel, Group, Separator } from "react-resizable-panels";

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_CLOSE_ANIMATION_MS = 250;

const TOAST = {
  pyodideLoading: { message: "Loading Python runtime… this may take a moment.", variant: "default", duration: 5000 },
  pyodideReady:   { message: "✓ Python runtime ready!", variant: "success", duration: 2500 },
  examEnded:      { message: "Exam ended. View your results.", variant: "default", duration: 4000 },
};

// ─── Isolated Sub-components ──────────────────────────────────────────────────

function ResizeHandle({ orientation = "horizontal" }) {
  const isHorizontal = orientation === "horizontal";
  return (
    <Separator
      className={`relative flex items-center justify-center bg-[#0a0a0a] transition-colors z-10
        ${isHorizontal ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"}`}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-border-main
          hover:bg-border-bright transition-colors
          ${isHorizontal ? "h-6 w-1" : "w-6 h-1"}`}
      />
    </Separator>
  );
}

function ExamLoadingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
      <Spinner size="lg" />
      <p className="text-text-secondary text-sm">Loading exam data…</p>
    </div>
  );
}

function PyodideLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[200] bg-[rgba(10,13,20,0.94)] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-[3px] border-border-main border-t-accent-cyan rounded-full animate-spin" />
      <p className="text-base font-semibold text-text-primary">Loading Python Runtime…</p>
      <p className="text-[0.8rem] text-text-muted">Initializing Pyodide WebAssembly engine</p>
    </div>
  );
}

// ─── Custom Hooks ─────────────────────────────────────────────────────────────

/**
 * Manages sidebar visibility with an animated close sequence.
 */
function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, SIDEBAR_CLOSE_ANIMATION_MS);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Clean up any pending timer on unmount
  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  return { isOpen, isClosing, open, close, toggle };
}

/**
 * Returns open/close state and handlers for a named set of confirmation modals.
 */
function useModals(...names) {
  const [openModal, setOpenModal] = useState(null);

  return Object.fromEntries(
    names.map((name) => [
      name,
      {
        isOpen: openModal === name,
        open:   () => setOpenModal(name),
        close:  () => setOpenModal(null),
      },
    ])
  );
}

/**
 * Fetches questions, seeds the exam context, and starts the timer once ready.
 */
function useExamInitializer(exam) {
  const [isLoading, setIsLoading] = useState(true);

  // Load questions exactly once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const questions = await getQuestions();
      if (!cancelled) {
        exam.loadQuestions(questions);
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally mount-only

  // Start exam once questions are available; use a ref for startExam to avoid
  // re-running if the context reference changes without semantic change.
  const startExamRef = useRef(exam.startExam);
  useEffect(() => { startExamRef.current = exam.startExam; });

  useEffect(() => {
    if (!isLoading && exam.questions.length > 0 && exam.status === "idle") {
      startExamRef.current();
    }
  }, [isLoading, exam.questions.length, exam.status]);

  return { isLoading };
}

/**
 * Initializes Pyodide after exam data has loaded. Fires a toast on each state change.
 */
function usePyodideInitializer(pyodide, isExamLoading) {
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  // Stable ref to avoid re-running when pyodide object reference changes
  const initializeRef = useRef(pyodide.initialize);
  useEffect(() => { initializeRef.current = pyodide.initialize; });

  useEffect(() => {
    if (isExamLoading) return;
    let cancelled = false;
    (async () => {
      showToast(TOAST.pyodideLoading.message, TOAST.pyodideLoading.variant, TOAST.pyodideLoading.duration);
      await initializeRef.current();
      if (!cancelled) {
        showToast(TOAST.pyodideReady.message, TOAST.pyodideReady.variant, TOAST.pyodideReady.duration);
        setIsPyodideLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isExamLoading]);

  return { isPyodideLoading };
}

/**
 * Keeps the editor in sync with the current question's saved draft,
 * and persists every keystroke back to the draft store.
 */
function useCodeEditor(exam) {
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [resultMode, setResultMode] = useState(null);

  useEffect(() => {
    if (!exam.currentQuestion) return;
    setCode(exam.getDraft(exam.currentQuestion.id, exam.currentQuestion.starterCode));
    setResults(null);
    setResultMode(null);
  }, [exam.currentQuestionIndex, exam.currentQuestion]);
  //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //  Both are needed:
  //  - currentQuestion: triggers on initial load (index stays 0, question goes null → object)
  //  - currentQuestionIndex: triggers when navigating between questions

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      if (exam.currentQuestion) {
        exam.saveDraft(exam.currentQuestion.id, newCode);
      }
    },
    [exam]
  );

  const resetToStarter = useCallback(() => {
    if (!exam.currentQuestion) return;
    const starter = exam.currentQuestion.starterCode;
    setCode(starter);
    exam.saveDraft(exam.currentQuestion.id, starter);
  }, [exam]);

  return { code, results, setResults, resultMode, setResultMode, handleCodeChange, resetToStarter };
}

/**
 * Provides run / submit / custom-input execution with shared loading state.
 */
function useCodeExecution({ code, exam, pyodide, setResults, setResultMode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [runningMode, setRunningMode] = useState(null);

  /**
   * Wraps an async execution function with shared isRunning / runningMode guards.
   * Returns early if already running or no question is selected.
   */
  const execute = useCallback(
    async (mode, fn) => {
      if (!exam.currentQuestion || isRunning) return;
      setIsRunning(true);
      setRunningMode(mode);
      try {
        await fn();
      } finally {
        setIsRunning(false);
        setRunningMode(null);
      }
    },
    [exam.currentQuestion, isRunning]
  );

  const handleRun = useCallback(
    () =>
      execute("run", async () => {
        try {
          const result = await pyodide.runSampleCases(code, exam.currentQuestion);
          setResults(result);
          setResultMode("run");
        } catch (e) {
          showToast(`Execution error: ${e.message}`, "error");
        }
      }),
    [execute, pyodide, code, exam.currentQuestion, setResults, setResultMode]
  );

  const handleSubmit = useCallback(
    () =>
      execute("submit", async () => {
        try {
          const result = await pyodide.runAllCases(code, exam.currentQuestion);
          setResults(result);
          setResultMode("submit");
          exam.recordSubmission(exam.currentQuestion.id, code, result);

          const { id, maxScore } = exam.currentQuestion;
          showToast(
            `Q${id}: ${result.passed}/${result.total} passed · Score: ${result.score}/${maxScore}`,
            result.passed === result.total ? "success" : "default"
          );
        } catch (e) {
          showToast(`Submission error: ${e.message}`, "error");
        }
      }),
    [execute, pyodide, code, exam, setResults, setResultMode]
  );

  const handleRunCustom = useCallback(
    (input) => pyodide.runCustomInput(code, input),
    [pyodide, code]
  );

  return { isRunning, runningMode, handleRun, handleSubmit, handleRunCustom };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExamShell() {
  const exam   = useExam();
  const pyodide = usePyodide();

  const sidebar = useSidebar();
  const modals  = useModals("endExam", "resetCode");
  const [showResults, setShowResults] = useState(false);

  const { isLoading }        = useExamInitializer(exam);
  const { isPyodideLoading } = usePyodideInitializer(pyodide, isLoading);

  const {
    code, results, setResults, resultMode, setResultMode,
    handleCodeChange, resetToStarter,
  } = useCodeEditor(exam);

  const { isRunning, runningMode, handleRun, handleSubmit, handleRunCustom } =
    useCodeExecution({ code, exam, pyodide, setResults, setResultMode });

  const handleEndExamConfirm = useCallback(() => {
    exam.finishExam();
    modals.endExam.close();
    setShowResults(true);
    showToast(TOAST.examEnded.message, TOAST.examEnded.variant, TOAST.examEnded.duration);
  }, [exam, modals.endExam]);

  const handleResetConfirm = useCallback(() => {
    resetToStarter();
    modals.resetCode.close();
  }, [resetToStarter, modals.resetCode]);

  if (isLoading) return <ExamLoadingScreen />;

  const isSidebarVisible = sidebar.isOpen || sidebar.isClosing;

  return (
    <>
      {isPyodideLoading && <PyodideLoadingOverlay />}

      <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">

        {/* ── Header ── */}
        <div className="shrink-0">
          <Header
            onFinishExam={modals.endExam.open}
            onViewResults={() => setShowResults(true)}
            pyodideReady={pyodide.isReady}
            onToggleSidebar={sidebar.toggle}
            isSidebarOpen={sidebar.isOpen}
          />
        </div>

        {/* ── Main content area ── */}
        <div className="flex-1 overflow-hidden p-2 min-h-0 relative">

          {/* Sidebar drawer + backdrop */}
          {isSidebarVisible && (
            <>
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-black/50 z-40
                  ${sidebar.isClosing ? "animate-fade-out" : "animate-fade-in"}`}
                onClick={sidebar.close}
              />
              <div
                className={`absolute left-2 top-2 bottom-2 w-[420px] z-50 rounded-lg
                  overflow-hidden bg-bg-secondary border border-border-main shadow-2xl
                  ${sidebar.isClosing ? "animate-slide-out-left" : "animate-slide-in-left"}`}
              >
                <Sidebar />
              </div>
            </>
          )}

          {/* Resizable panel layout */}
          <Group orientation="horizontal" className="h-full">

            {/* Problem description */}
            <Panel
              defaultSize={50}
              minSize={20}
              className="rounded-lg overflow-hidden bg-bg-secondary border border-border-main flex flex-col"
            >
              <ProblemPanel question={exam.currentQuestion} />
            </Panel>

            <ResizeHandle orientation="horizontal" />

            {/* Code editor + output stacked vertically */}
            <Panel defaultSize={50} minSize={30}>
              <Group orientation="vertical" className="h-full">

                <Panel
                  defaultSize={65}
                  minSize={30}
                  className="rounded-lg overflow-hidden bg-bg-secondary border border-border-main flex flex-col"
                >
                  <CodePanel
                    question={exam.currentQuestion}
                    code={code}
                    onCodeChange={handleCodeChange}
                    onRun={handleRun}
                    onSubmit={handleSubmit}
                    onReset={modals.resetCode.open}
                    isRunning={isRunning}
                    runningMode={runningMode}
                    pyodideReady={pyodide.isReady}
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
                  />
                </Panel>

              </Group>
            </Panel>

          </Group>
        </div>
      </div>

      {/* Results overlay */}
      {showResults && <ResultsScreen onClose={() => setShowResults(false)} />}

      {/* Confirmation modals */}
      <Modal
        isOpen={modals.endExam.isOpen}
        title="End Exam"
        message="Are you sure you want to end the exam now? This action cannot be undone. Your current submissions will be saved."
        confirmText="End Exam"
        cancelText="Continue"
        variant="danger"
        onConfirm={handleEndExamConfirm}
        onCancel={modals.endExam.close}
      />

      <Modal
        isOpen={modals.resetCode.isOpen}
        title="Reset Code"
        message="Reset to starter code? Your current code for this question will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleResetConfirm}
        onCancel={modals.resetCode.close}
      />

      <Toast />
    </>
  );
}