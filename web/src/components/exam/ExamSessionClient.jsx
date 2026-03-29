"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";
import { usePyodide } from "@/hooks/usePyodide";
import { useTimer } from "@/hooks/useTimer";
import { useExamIntegrityGuards } from "@/hooks/useExamIntegrityGuards";
import {
  getNextQuestionIndex,
  getPreviousQuestionIndex,
} from "@/lib/workspace/navigation.mjs";
import { useExamStore, useExamStoreApi } from "@/providers/ExamStoreProvider.jsx";

import CodePanel from "../workspace/CodePanel.jsx";
import ExamIntegrityOverlay from "./ExamIntegrityOverlay.jsx";
import OutputPanel from "../workspace/OutputPanel.jsx";
import ProblemPanel from "../workspace/ProblemPanel.jsx";
import QuestionSidebar from "../workspace/QuestionSidebar.jsx";
import WorkspaceChrome from "../workspace/WorkspaceChrome.jsx";
import WorkspaceHeader from "../workspace/WorkspaceHeader.jsx";
import {
  PyodideLoadingOverlay,
  WorkspaceLoadingScreen,
} from "../workspace/WorkspaceLoadingStates.jsx";
import {
  useDialogState,
  usePyodideInitializer,
  useSidebarState,
  useWorkspaceCodeEditor,
  useWorkspaceExecution,
  WorkspaceToastHost,
} from "../workspace/workspaceHooks.js";

const INTEGRITY_MESSAGES = {
  clipboard: "Copy and paste is disabled during the exam.",
  "context-menu": "The context menu is disabled during the exam.",
  "fullscreen-exit": "Returning to fullscreen is required to continue the exam.",
  "tab-switch": "Leaving the exam tab is not allowed during the session.",
};

async function requestAppFullscreen() {
  if (typeof document === "undefined") {
    return false;
  }

  const rootElement = document.documentElement;
  if (!rootElement.requestFullscreen) {
    return false;
  }

  await rootElement.requestFullscreen();
  return Boolean(document.fullscreenElement);
}

function buildSidebarQuestions(questions, session, currentQuestionIndex) {
  return questions.map((question, index) => {
    const submission = session.workspace.submissionsByQuestionId?.[question.id];
    const hasDraft = session.workspace.draftsByQuestionId?.[question.id] !== undefined;
    const isSolved = Boolean(submission && submission.score >= question.maxScore);
    const isPartial = Boolean(submission && submission.score > 0 && !isSolved);
    const isCurrent = index === currentQuestionIndex;

    let status = "not-started";
    let statusTitle = "Not started";

    if (isSolved) {
      status = "completed";
      statusTitle = `${submission.score}/${question.maxScore}`;
    } else if (isPartial) {
      status = "partial";
      statusTitle = `${submission.score}/${question.maxScore}`;
    } else if (hasDraft || isCurrent) {
      status = "in-progress";
      statusTitle = "In progress";
    }

    return {
      ...question,
      status,
      statusTitle,
    };
  });
}

export default function ExamSessionClient({ sessionId }) {
  const router = useRouter();
  const examStoreApi = useExamStoreApi();
  const hydrationStatus = useExamStore((state) => state.hydrationStatus);
  const session = useExamStore((state) => state.activeSession);
  const questions = useExamStore((state) => state.selectedQuestions);
  const pyodide = usePyodide();

  const sidebar = useSidebarState();
  const finishDialog = useDialogState();
  const resetDialog = useDialogState();
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [requiresFullscreenResume, setRequiresFullscreenResume] = useState(false);

  useEffect(() => {
    examStoreApi.getState().hydrateSession(sessionId).catch(() => {});
  }, [examStoreApi, sessionId]);

  useEffect(() => {
    if (hydrationStatus === "missing") {
      router.replace("/exam");
      return;
    }

    if (
      hydrationStatus === "ready" &&
      session &&
      session.lifecycle.status !== "active"
    ) {
      router.replace(`/results/${session.id}`);
    }
  }, [hydrationStatus, router, session]);

  const { isPyodideLoading } = usePyodideInitializer(
    pyodide,
    hydrationStatus !== "ready"
  );

  const currentQuestionIndex = session?.navigation.currentQuestionIndex ?? 0;
  const currentQuestion = questions[currentQuestionIndex] || null;

  const {
    code,
    results,
    setResults,
    resultMode,
    setResultMode,
    handleCodeChange,
    resetToStarter,
  } = useWorkspaceCodeEditor({
    currentQuestion,
    getDraft: (questionId, fallbackStarter) =>
      session?.workspace.draftsByQuestionId?.[questionId]?.code ??
      fallbackStarter ??
      "",
    saveDraft: (questionId, draftCode) =>
      examStoreApi.getState().saveDraft(questionId, draftCode),
  });

  const handleFinishExam = useCallback(
    async (reason = "completed") => {
      const completedSession = await examStoreApi.getState().completeSession(reason);

      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      setRequiresFullscreenResume(false);
      finishDialog.close();

      if (completedSession) {
        router.replace(`/results/${completedSession.id}`);
      }
    },
    [examStoreApi, finishDialog, router]
  );

  const timerState = useMemo(
    () => examStoreApi.getState().getTimerState(),
    [
      examStoreApi,
      session?.assessment.durationSeconds,
      session?.lifecycle.startedAt,
      session?.lifecycle.status,
    ]
  );

  const { formatTime, remainingSeconds: remainingTime } = useTimer({
    durationSeconds: session?.assessment.durationSeconds || 0,
    elapsedSeconds: timerState.elapsedSeconds,
    isRunning: timerState.isRunning,
    onTimeUp: () => handleFinishExam("time-limit"),
  });

  useEffect(() => {
    if (session?.lifecycle.status === "active" && timerState.isExpired) {
      handleFinishExam("time-limit");
    }
  }, [handleFinishExam, session?.lifecycle.status, timerState.isExpired]);

  const recordViolation = useCallback(
    async (type) => {
      if (session?.lifecycle.status !== "active") {
        return;
      }

      const outcome = await examStoreApi.getState().recordIntegrityViolation(type);

      if (type === "fullscreen-exit") {
        setRequiresFullscreenResume(true);
      }

      if (outcome.shouldTerminate) {
        showToast(
          "The exam ended after repeated integrity violations.",
          "error",
          5000
        );
        handleFinishExam("integrity-limit");
        return;
      }

      const nextWarningCount = outcome.violations.length;
      showToast(
        `${INTEGRITY_MESSAGES[type] || "Integrity warning recorded."} Warning ${nextWarningCount}/${session?.policy.maxViolations || 3}.`,
        "error",
        4500
      );
    },
    [examStoreApi, handleFinishExam, session]
  );

  useExamIntegrityGuards({
    blockClipboard: session?.policy.blockClipboard,
    blockContextMenu: session?.policy.blockContextMenu,
    isActive: session?.lifecycle.status === "active",
    onFullscreenStateChange: (nextIsFullscreen) => {
      setIsFullscreenActive(nextIsFullscreen);
      if (nextIsFullscreen) {
        setRequiresFullscreenResume(false);
      }
    },
    onViolation: recordViolation,
    requireFullscreen: session?.policy.requireFullscreen,
    warnBeforeUnload: session?.policy.warnBeforeUnload,
  });

  useEffect(() => {
    if (
      session?.lifecycle.status === "active" &&
      session?.policy.requireFullscreen &&
      !isFullscreenActive
    ) {
      setRequiresFullscreenResume(true);
    }
  }, [isFullscreenActive, session?.lifecycle.status, session?.policy.requireFullscreen]);

  const interactionBlockedByIntegrity =
    session?.lifecycle.status !== "active" ||
    (session?.policy.requireFullscreen && requiresFullscreenResume);
  const interactionDisabledMessage = !currentQuestion
    ? "Loading the selected exam problem."
    : interactionBlockedByIntegrity
    ? "Return to fullscreen mode to continue the exam."
    : "";

  const {
    isRunning,
    runningMode,
    handleRun,
    handleSubmit,
    handleRunCustom,
  } = useWorkspaceExecution({
    code,
    currentQuestion,
    disableReason: interactionDisabledMessage,
    formatSubmissionToast: ({ currentQuestion: targetQuestion, result }) => ({
      message: `Q${targetQuestion.id}: ${result.passed}/${result.total} passed | Score: ${result.score}/${targetQuestion.maxScore}`,
      variant: result.passed === result.total ? "success" : "default",
    }),
    isInteractionDisabled: interactionBlockedByIntegrity,
    pyodide,
    setResultMode,
    setResults,
    onSuccessfulSubmission: ({ code: submittedCode, questionId: targetQuestionId, result }) =>
      examStoreApi
        .getState()
        .recordSubmission(targetQuestionId, submittedCode, result),
  });

  const handleResumeFullscreen = useCallback(async () => {
    try {
      const enteredFullscreen = await requestAppFullscreen();

      if (!enteredFullscreen) {
        showToast("Fullscreen is required to keep the exam active.", "error", 4000);
        return;
      }

      setIsFullscreenActive(true);
      setRequiresFullscreenResume(false);
    } catch {
      showToast("Fullscreen is required to keep the exam active.", "error", 4000);
    }
  }, []);

  const handleResetCodeConfirm = useCallback(() => {
    resetToStarter();
    resetDialog.close();
  }, [resetDialog, resetToStarter]);

  if (hydrationStatus !== "ready" || !session || session.id !== sessionId) {
    return <WorkspaceLoadingScreen label="Loading secure exam workspace..." />;
  }

  const sidebarQuestions = buildSidebarQuestions(
    questions,
    session,
    currentQuestionIndex
  );
  const questionCount = questions.length;
  const sidebarVisible = sidebar.isOpen || sidebar.isClosing;

  return (
    <>
      {isPyodideLoading && <PyodideLoadingOverlay />}

      <WorkspaceChrome
        header={
          <WorkspaceHeader
            canGoNext={currentQuestionIndex < questionCount - 1}
            canGoPrevious={currentQuestionIndex > 0}
            currentQuestionLabel={`Exam Session - Question ${currentQuestionIndex + 1} of ${questionCount}`}
            currentQuestionTitle={currentQuestion?.title || "Loading question"}
            integrityCount={session.integrity.violations.length}
            onNextQuestion={() =>
              examStoreApi
                .getState()
                .setCurrentQuestionIndex(
                  getNextQuestionIndex(currentQuestionIndex, questionCount)
                )
            }
            onPreviousQuestion={() =>
              examStoreApi
                .getState()
                .setCurrentQuestionIndex(
                  getPreviousQuestionIndex(currentQuestionIndex, questionCount)
                )
            }
            onPrimaryAction={finishDialog.open}
            onToggleSidebar={sidebar.toggle}
            primaryActionLabel="Finish Exam"
            scoreLabel={`Score ${session.summary.totalScore}/${session.summary.maxScore}`}
            timerLabel={`Time Left ${formatTime(remainingTime)}`}
            timerTone={
              remainingTime <= 15 * 60
                ? "critical"
                : remainingTime <= 30 * 60
                ? "warning"
                : "neutral"
            }
          />
        }
        sidebar={
          <QuestionSidebar
            currentQuestionIndex={currentQuestionIndex}
            description="Use the list or arrow buttons to move between the exam questions."
            questions={sidebarQuestions}
            onSelectQuestion={(index) =>
              examStoreApi.getState().setCurrentQuestionIndex(index)
            }
            title="Exam Problems"
          />
        }
        sidebarVisible={sidebarVisible}
        sidebarClosing={sidebar.isClosing}
        onCloseSidebar={sidebar.close}
        problemPanel={
          <ProblemPanel
            question={currentQuestion}
            timeSummary={`Shared ${Math.round(session.assessment.durationSeconds / 60)}-minute exam timer across all questions`}
          />
        }
        codePanel={
          <CodePanel
            code={code}
            onCodeChange={handleCodeChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={resetDialog.open}
            isRunning={isRunning}
            runningMode={runningMode}
            pyodideReady={pyodide.isReady}
            isDisabled={interactionBlockedByIntegrity}
            disabledMessage={interactionDisabledMessage}
          />
        }
        outputPanel={
          <OutputPanel
            results={results}
            mode={resultMode}
            question={currentQuestion}
            onRunCustom={handleRunCustom}
            isRunning={isRunning}
            isInteractionDisabled={interactionBlockedByIntegrity}
            disableReason={interactionDisabledMessage}
          />
        }
      />

      <ExamIntegrityOverlay
        actionLabel="Re-enter Fullscreen"
        description="The exam is paused behind this guard until fullscreen mode is restored. Returning to fullscreen lets you continue where you left off."
        isOpen={requiresFullscreenResume}
        onAction={handleResumeFullscreen}
        title="Fullscreen is required to continue"
        warningCount={session.integrity.violations.length}
        warningLimit={session.policy.maxViolations}
      />

      <Modal
        isOpen={finishDialog.isOpen}
        title="Finish Exam"
        message="End the exam now and lock in the best submitted score for each question?"
        confirmText="Finish Exam"
        cancelText="Keep Working"
        variant="danger"
        onConfirm={() => handleFinishExam("completed")}
        onCancel={finishDialog.close}
      />

      <Modal
        isOpen={resetDialog.isOpen}
        title="Reset Code"
        message="Reset this question to the starter code? Your current exam draft for the selected problem will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleResetCodeConfirm}
        onCancel={resetDialog.close}
      />

      <WorkspaceToastHost />
    </>
  );
}
