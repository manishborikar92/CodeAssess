"use client";

import { useState, useCallback, useEffect } from "react";
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

export default function ExamShell() {
  const exam = useExam();
  const pyodide = usePyodide();

  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [resultMode, setResultMode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runningMode, setRunningMode] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pyodideLoading, setPyodideLoading] = useState(true);

  // ── Load questions and initialize ──
  useEffect(() => {
    (async () => {
      const questions = await getQuestions();
      exam.loadQuestions(questions);
      setIsLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start exam on mount ──
  useEffect(() => {
    if (!isLoading && exam.questions.length > 0 && exam.status === "idle") {
      exam.startExam();
    }
  }, [isLoading, exam.questions.length, exam.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Initialize Pyodide ──
  useEffect(() => {
    if (!isLoading) {
      (async () => {
        showToast("Loading Python runtime… this may take a moment.", "default", 5000);
        await pyodide.initialize();
        showToast("✓ Python runtime ready!", "success", 2500);
        setPyodideLoading(false);
      })();
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync code with current question ──
  useEffect(() => {
    if (exam.currentQuestion) {
      const draft = exam.getDraft(
        exam.currentQuestion.id,
        exam.currentQuestion.starterCode
      );
      setCode(draft);
      setResults(null);
      setResultMode(null);
    }
  }, [exam.currentQuestionIndex, exam.currentQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Code change handler (auto-save draft) ──
  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      if (exam.currentQuestion) {
        exam.saveDraft(exam.currentQuestion.id, newCode);
      }
    },
    [exam]
  );

  // ── Run samples ──
  const handleRun = useCallback(async () => {
    if (!exam.currentQuestion || isRunning) return;
    setIsRunning(true);
    setRunningMode("run");

    try {
      const result = await pyodide.runSampleCases(code, exam.currentQuestion);
      setResults(result);
      setResultMode("run");
    } catch (e) {
      showToast("Execution error: " + e.message, "error");
    } finally {
      setIsRunning(false);
      setRunningMode(null);
    }
  }, [code, exam.currentQuestion, isRunning, pyodide]);

  // ── Submit all ──
  const handleSubmit = useCallback(async () => {
    if (!exam.currentQuestion || isRunning) return;
    setIsRunning(true);
    setRunningMode("submit");

    try {
      const result = await pyodide.runAllCases(code, exam.currentQuestion);
      setResults(result);
      setResultMode("submit");

      exam.recordSubmission(exam.currentQuestion.id, code, result);

      const q = exam.currentQuestion;
      showToast(
        `Q${q.id}: ${result.passed}/${result.total} passed · Score: ${result.score}/${q.maxScore}`,
        result.passed === result.total ? "success" : "default"
      );
    } catch (e) {
      showToast("Submission error: " + e.message, "error");
    } finally {
      setIsRunning(false);
      setRunningMode(null);
    }
  }, [code, exam, isRunning, pyodide]);

  // ── Run custom input ──
  const handleRunCustom = useCallback(
    async (input) => {
      return pyodide.runCustomInput(code, input);
    },
    [code, pyodide]
  );

  // ── Reset code ──
  const handleResetConfirm = useCallback(() => {
    if (exam.currentQuestion) {
      const starter = exam.currentQuestion.starterCode;
      setCode(starter);
      exam.saveDraft(exam.currentQuestion.id, starter);
    }
    setShowResetModal(false);
  }, [exam]);

  // ── End exam ──
  const handleEndExam = useCallback(() => {
    exam.finishExam();
    setShowEndModal(false);
    setShowResults(true);
    showToast("Exam ended. View your results.", "default", 4000);
  }, [exam]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary text-sm">Loading exam data…</p>
      </div>
    );
  }

  return (
    <>
      {/* Pyodide loading overlay */}
      {pyodideLoading && (
        <div className="fixed inset-0 z-[200] bg-[rgba(10,13,20,0.94)] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-[3px] border-border-main border-t-accent-cyan rounded-full animate-spin" />
          <div className="text-base font-semibold text-text-primary">
            Loading Python Runtime…
          </div>
          <div className="text-[0.8rem] text-text-muted">
            Initializing Pyodide WebAssembly engine
          </div>
        </div>
      )}

      {/* Main exam layout */}
      <div className="h-screen grid grid-rows-[52px_1fr] grid-cols-[260px_1fr]"
        style={{ gridTemplateAreas: '"header header" "sidebar main"' }}>
        {/* Header */}
        <div style={{ gridArea: "header" }}>
          <Header
            onFinishExam={() => setShowEndModal(true)}
            onViewResults={() => setShowResults(true)}
            pyodideReady={pyodide.isReady}
          />
        </div>

        {/* Sidebar */}
        <div style={{ gridArea: "sidebar" }} className="overflow-hidden h-full min-h-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <div style={{ gridArea: "main" }} className="grid grid-cols-2 overflow-hidden min-h-0">
          {/* Problem panel */}
          <div className="overflow-hidden min-h-0 h-full">
            <ProblemPanel question={exam.currentQuestion} />
          </div>

          {/* Code + Output */}
          <div className="flex flex-col overflow-hidden min-h-0 h-full">
            <div className="flex-1 overflow-hidden min-h-0">
              <CodePanel
                question={exam.currentQuestion}
                code={code}
                onCodeChange={handleCodeChange}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onReset={() => setShowResetModal(true)}
                isRunning={isRunning}
                runningMode={runningMode}
                pyodideReady={pyodide.isReady}
              />
            </div>
            <OutputPanel
              results={results}
              mode={resultMode}
              question={exam.currentQuestion}
              onRunCustom={handleRunCustom}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>

      {/* Results screen overlay */}
      {showResults && (
        <ResultsScreen onClose={() => setShowResults(false)} />
      )}

      {/* Modals */}
      <Modal
        isOpen={showEndModal}
        title="End Exam"
        message="Are you sure you want to end the exam now? This action cannot be undone. Your current submissions will be saved."
        confirmText="End Exam"
        cancelText="Continue"
        variant="danger"
        onConfirm={handleEndExam}
        onCancel={() => setShowEndModal(false)}
      />

      <Modal
        isOpen={showResetModal}
        title="Reset Code"
        message="Reset to starter code? Your current code for this question will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetModal(false)}
      />

      <Toast />
    </>
  );
}
