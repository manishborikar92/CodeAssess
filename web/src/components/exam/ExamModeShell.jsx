"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useExam } from "@/context/ExamContext";
import { usePyodide } from "@/hooks/usePyodide";
import { useTimer } from "@/hooks/useTimer";
import { useExamIntegrityGuards } from "@/hooks/useExamIntegrityGuards";
import {
  getNextQuestionIndex,
  getPreviousQuestionIndex,
} from "@/lib/workspaceNavigation.mjs";

import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";
import CodePanel from "./CodePanel";
import ExamIntegrityOverlay from "./ExamIntegrityOverlay";
import ExamResultsScreen from "./ExamResultsScreen";
import ExamStartScreen from "./ExamStartScreen";
import OutputPanel from "./OutputPanel";
import ProblemPanel from "./ProblemPanel";
import QuestionSidebar from "./QuestionSidebar";
import WorkspaceChrome from "./WorkspaceChrome";
import WorkspaceHeader from "./WorkspaceHeader";
import {
  PyodideLoadingOverlay,
  WorkspaceLoadingScreen,
} from "./WorkspaceLoadingStates";
import {
  useDialogState,
  usePyodideInitializer,
  useSidebarState,
  useWorkspaceCodeEditor,
  useWorkspaceExecution,
  WorkspaceToastHost,
} from "./workspaceHooks";

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

function buildExamSidebarQuestions(questions, session, currentQuestionIndex) {
  return questions.map((question, index) => {
    const submission = session.submissions?.[question.id];
    const hasDraft = session.drafts?.[question.id] !== undefined;
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

function formatExamSubmissionToast({ currentQuestion, result }) {
  return {
    message: `Q${currentQuestion.id}: ${result.passed}/${result.total} passed | Score: ${result.score}/${currentQuestion.maxScore}`,
    variant: result.passed === result.total ? "success" : "default",
  };
}

export default function ExamModeShell() {
  const {
    acceptRules,
    config,
    currentQuestion,
    durationSeconds,
    finishExam,
    getDraft,
    isLoading,
    maxScore,
    questions,
    recordIntegrityViolation,
    recordSubmission,
    resetExam,
    saveDraft,
    session,
    setQuestion,
    startExam,
    timerState,
    totalScore,
  } = useExam();
  const pyodide = usePyodide();
  const sidebar = useSidebarState();
  const finishDialog = useDialogState();
  const resetDialog = useDialogState();
  const [isStarting, setIsStarting] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [requiresFullscreenResume, setRequiresFullscreenResume] = useState(false);
  const questionCount = questions.length;

  const { isPyodideLoading } = usePyodideInitializer(pyodide, isLoading);

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
    getDraft,
    saveDraft,
  });

  const handleRecordSubmission = useCallback(
    ({ code: submittedCode, questionId, result }) => {
      recordSubmission(questionId, submittedCode, result);
    },
    [recordSubmission]
  );

  const handleFinishExam = useCallback(
    (reason = "completed") => {
      finishExam(reason);

      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      setRequiresFullscreenResume(false);
      finishDialog.close();
    },
    [finishDialog, finishExam]
  );

  const { formatTime, remainingSeconds: remainingTime } = useTimer({
    durationSeconds,
    elapsedSeconds: timerState.elapsedSeconds,
    isRunning: timerState.isRunning,
    onTimeUp: () => handleFinishExam("time-limit"),
  });

  useEffect(() => {
    if (session.status === "active" && timerState.isExpired) {
      handleFinishExam("time-limit");
    }
  }, [handleFinishExam, session.status, timerState.isExpired]);

  const recordViolation = useCallback(
    (type) => {
      if (session.status !== "active") {
        return;
      }

      const outcome = recordIntegrityViolation(type);

      if (outcome.violations.length === session.integrityViolations.length) {
        return;
      }

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
        `${INTEGRITY_MESSAGES[type] || "Integrity warning recorded."} Warning ${nextWarningCount}/${config?.integrityPolicy.maxViolations || 3}.`,
        "error",
        4500
      );
    },
    [
      config?.integrityPolicy.maxViolations,
      handleFinishExam,
      recordIntegrityViolation,
      session.integrityViolations.length,
      session.status,
    ]
  );

  useExamIntegrityGuards({
    blockClipboard: config?.integrityPolicy.blockClipboard,
    blockContextMenu: config?.integrityPolicy.blockContextMenu,
    isActive: session.status === "active",
    onFullscreenStateChange: (nextIsFullscreen) => {
      setIsFullscreenActive(nextIsFullscreen);
      if (nextIsFullscreen) {
        setRequiresFullscreenResume(false);
      }
    },
    onViolation: recordViolation,
    requireFullscreen: config?.integrityPolicy.requireFullscreen,
    warnBeforeUnload: config?.integrityPolicy.warnBeforeUnload,
  });

  useEffect(() => {
    if (
      session.status === "active" &&
      config?.integrityPolicy.requireFullscreen &&
      !isFullscreenActive
    ) {
      setRequiresFullscreenResume(true);
    }
  }, [config?.integrityPolicy.requireFullscreen, isFullscreenActive, session.status]);

  const interactionBlockedByIntegrity =
    session.status !== "active" ||
    (config?.integrityPolicy.requireFullscreen && requiresFullscreenResume);
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
    formatSubmissionToast: formatExamSubmissionToast,
    isInteractionDisabled: interactionBlockedByIntegrity,
    pyodide,
    setResultMode,
    setResults,
    onSuccessfulSubmission: handleRecordSubmission,
  });

  const handleStartExam = useCallback(async () => {
    if (!config || !session.acceptedRules) {
      return;
    }

    setIsStarting(true);

    try {
      const enteredFullscreen = config.integrityPolicy.requireFullscreen
        ? await requestAppFullscreen()
        : true;

      if (!enteredFullscreen && config.integrityPolicy.requireFullscreen) {
        showToast(
          "Fullscreen permission is required to start this exam.",
          "error",
          4500
        );
        return;
      }

      setIsFullscreenActive(Boolean(document.fullscreenElement));
      setRequiresFullscreenResume(false);
      const didStart = startExam();

      if (!didStart) {
        showToast("No questions are available for this exam right now.", "error", 4500);
        return;
      }

      sidebar.close();
    } catch {
      showToast("The browser blocked fullscreen mode. Try again to start the exam.", "error");
    } finally {
      setIsStarting(false);
    }
  }, [config, session.acceptedRules, sidebar, startExam]);

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

  const handleResetExam = useCallback(() => {
    resetExam();
    setIsFullscreenActive(false);
    setRequiresFullscreenResume(false);

    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [resetExam]);

  const handleResetCodeConfirm = useCallback(() => {
    resetToStarter();
    resetDialog.close();
  }, [resetDialog, resetToStarter]);

  const sidebarQuestions = useMemo(
    () => buildExamSidebarQuestions(questions, session, session.currentQuestionIndex),
    [questions, session]
  );
  const activeQuestionIndex = session.currentQuestionIndex ?? 0;
  const sidebarVisible = sidebar.isOpen || sidebar.isClosing;
  const handlePreviousQuestion = useCallback(() => {
    setQuestion(getPreviousQuestionIndex(activeQuestionIndex, questionCount));
  }, [activeQuestionIndex, questionCount, setQuestion]);
  const handleNextQuestion = useCallback(() => {
    setQuestion(getNextQuestionIndex(activeQuestionIndex, questionCount));
  }, [activeQuestionIndex, questionCount, setQuestion]);
  const handleSelectQuestion = useCallback(
    (index) => {
      setQuestion(index);
      sidebar.close();
    },
    [setQuestion, sidebar]
  );

  if (isLoading || !config) {
    return <WorkspaceLoadingScreen label="Loading secure exam workspace..." />;
  }

  if (
    session.status === "completed" ||
    session.status === "time-limit" ||
    session.status === "integrity-limit"
  ) {
    return (
      <>
        <ExamResultsScreen
          onReset={handleResetExam}
          questions={questions}
          session={session}
          totalDurationSeconds={durationSeconds}
        />
        <WorkspaceToastHost />
      </>
    );
  }

  if (session.status === "ready") {
    return (
      <>
        <ExamStartScreen
          config={config}
          isStarting={isStarting}
          onAcceptRulesChange={acceptRules}
          onStart={handleStartExam}
          rulesAccepted={session.acceptedRules}
        />
        <WorkspaceToastHost />
      </>
    );
  }

  return (
    <>
      {isPyodideLoading && <PyodideLoadingOverlay />}

      <WorkspaceChrome
        header={
          <WorkspaceHeader
            canGoNext={activeQuestionIndex < questionCount - 1}
            canGoPrevious={activeQuestionIndex > 0}
            currentQuestionLabel={`Exam Session - Question ${activeQuestionIndex + 1} of ${questionCount}`}
            currentQuestionTitle={currentQuestion?.title || "Loading question"}
            integrityCount={session.integrityViolations.length}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onPrimaryAction={finishDialog.open}
            onToggleSidebar={sidebar.toggle}
            primaryActionLabel="Finish Exam"
            scoreLabel={`Score ${totalScore}/${maxScore}`}
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
            currentQuestionIndex={session.currentQuestionIndex}
            description="Use the list or arrow buttons to move between the exam questions."
            questions={sidebarQuestions}
            onSelectQuestion={handleSelectQuestion}
            title="Exam Problems"
          />
        }
        sidebarVisible={sidebarVisible}
        sidebarClosing={sidebar.isClosing}
        onCloseSidebar={sidebar.close}
        problemPanel={
          <ProblemPanel
            question={currentQuestion}
            timeSummary="Shared 90-minute exam timer across all questions"
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
        warningCount={session.integrityViolations.length}
        warningLimit={config.integrityPolicy.maxViolations}
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
