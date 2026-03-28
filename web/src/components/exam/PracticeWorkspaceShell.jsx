"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePracticeSession } from "@/context/PracticeSessionContext";
import { usePyodide } from "@/hooks/usePyodide";
import { useTimer } from "@/hooks/useTimer";
import { getQuestions } from "@/lib/api";
import {
  getNextQuestionIndex,
  getPreviousQuestionIndex,
  getRandomQuestionIndex,
} from "@/lib/workspaceNavigation.mjs";

import Modal from "@/components/ui/Modal";
import CodePanel from "./CodePanel";
import OutputPanel from "./OutputPanel";
import PracticeResultsScreen from "./PracticeResultsScreen";
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
import { showToast } from "@/components/ui/Toast";

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

function formatPracticeSubmissionToast({ currentQuestion, result }) {
  return {
    message: `Q${currentQuestion.id}: ${result.passed}/${result.total} passed | Score: ${result.score}/${currentQuestion.maxScore}`,
    variant: result.passed === result.total ? "success" : "default",
  };
}

export default function PracticeWorkspaceShell() {
  const practiceSession = usePracticeSession();
  const pyodide = usePyodide();

  const sidebar = useSidebarState();
  const resetDialog = useDialogState();
  const resultsDialog = useDialogState();
  const { isLoading } = usePracticeInitializer({
    loadQuestions: practiceSession.loadQuestions,
    restoreSession: practiceSession.restoreSession,
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
  } = useWorkspaceCodeEditor({
    currentQuestion: practiceSession.currentQuestion,
    getDraft: practiceSession.getDraft,
    saveDraft: practiceSession.saveDraft,
  });

  const hasSelectedQuestion = Boolean(practiceSession.currentQuestion);
  const isQuestionExpired = Boolean(practiceSession.currentQuestionTimer?.isExpired);
  const activeQuestionIndex = practiceSession.currentQuestionIndex ?? 0;

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
  } = useWorkspaceExecution({
    code,
    currentQuestion: practiceSession.currentQuestion,
    disableReason: interactionDisabledMessage,
    formatSubmissionToast: formatPracticeSubmissionToast,
    isInteractionDisabled: !hasSelectedQuestion || isQuestionExpired,
    pyodide,
    setResultMode,
    setResults,
    onSuccessfulSubmission: ({ code: submittedCode, questionId, result }) =>
      practiceSession.recordSubmission(questionId, submittedCode, result),
  });

  const expiredQuestionToastRef = useRef(null);
  const notifyQuestionExpired = useCallback(
    (questionId) => {
      if (!questionId || expiredQuestionToastRef.current === questionId) {
        return;
      }

      expiredQuestionToastRef.current = questionId;
      practiceSession.expireQuestion(questionId);
      sidebar.open();
      showToast(
        `Q${questionId}: the 30-minute limit has ended. Choose another question to keep practicing.`,
        "error",
        5000
      );
    },
    [practiceSession, sidebar]
  );

  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(null);
  const { formatTime } = useTimer({
    durationSeconds: practiceSession.currentQuestion?.timeLimitSeconds || 0,
    elapsedSeconds: practiceSession.currentQuestionTimer?.spentSeconds || 0,
    isRunning: practiceSession.currentQuestionTimer?.isRunning || false,
    onTick: ({ remaining }) => setQuestionTimeRemaining(remaining),
    onTimeUp: () => {
      if (practiceSession.currentQuestion) {
        notifyQuestionExpired(practiceSession.currentQuestion.id);
      }
    },
  });

  const autoOpenSidebarRef = useRef(false);
  useEffect(() => {
    if (
      isLoading ||
      autoOpenSidebarRef.current ||
      practiceSession.questions.length === 0 ||
      practiceSession.currentQuestion
    ) {
      return;
    }

    autoOpenSidebarRef.current = true;
    sidebar.open();
  }, [
    isLoading,
    practiceSession.currentQuestion,
    practiceSession.questions.length,
    sidebar,
  ]);

  useEffect(() => {
    if (!practiceSession.currentQuestion || !practiceSession.currentQuestionTimer?.isExpired) {
      return;
    }

    notifyQuestionExpired(practiceSession.currentQuestion.id);
  }, [
    notifyQuestionExpired,
    practiceSession.currentQuestion,
    practiceSession.currentQuestionTimer?.isExpired,
  ]);

  const handlePreviousQuestion = useCallback(() => {
    if (!hasSelectedQuestion) {
      return;
    }

    practiceSession.setQuestion(
      getPreviousQuestionIndex(activeQuestionIndex, practiceSession.questions.length)
    );
  }, [activeQuestionIndex, hasSelectedQuestion, practiceSession]);

  const handleNextQuestion = useCallback(() => {
    if (!hasSelectedQuestion) {
      return;
    }

    practiceSession.setQuestion(
      getNextQuestionIndex(activeQuestionIndex, practiceSession.questions.length)
    );
  }, [activeQuestionIndex, hasSelectedQuestion, practiceSession]);

  const handleShuffleQuestion = useCallback(() => {
    if (!hasSelectedQuestion || practiceSession.questions.length < 2) {
      return;
    }

    practiceSession.setQuestion(
      getRandomQuestionIndex(activeQuestionIndex, practiceSession.questions.length)
    );
  }, [activeQuestionIndex, hasSelectedQuestion, practiceSession]);

  const handleSelectQuestion = useCallback(
    (index) => {
      practiceSession.setQuestion(index);
      sidebar.close();
    },
    [practiceSession, sidebar]
  );

  const handleResetConfirm = useCallback(() => {
    resetToStarter();
    resetDialog.close();
  }, [resetDialog, resetToStarter]);

  const sidebarQuestions = practiceSession.questions.map((question) => {
    const submission = practiceSession.getSubmissionStatus(question.id);
    const timer = practiceSession.getQuestionTimerStatus(question.id);
    const hasDraft = practiceSession.drafts[question.id] !== undefined;
    const isSolved = Boolean(submission && submission.score >= question.maxScore);
    const isPartial = Boolean(submission && submission.score > 0 && !isSolved);
    const isInProgress = !submission && (timer.hasStarted || hasDraft);

    let status = "not-started";
    let statusTitle = "Not started";

    if (isSolved) {
      status = "completed";
      statusTitle = `${submission.score}/${question.maxScore}`;
    } else if (isPartial) {
      status = "partial";
      statusTitle = `${submission.score}/${question.maxScore}`;
    } else if (timer.isExpired) {
      status = "expired";
      statusTitle = "Time limit reached";
    } else if (isInProgress) {
      status = "in-progress";
      statusTitle = "In progress";
    }

    return {
      ...question,
      status,
      statusTitle,
    };
  });

  if (isLoading) {
    return <WorkspaceLoadingScreen label="Loading practice workspace..." />;
  }

  const sidebarVisible = sidebar.isOpen || sidebar.isClosing;
  const currentTimerSeconds =
    questionTimeRemaining ?? practiceSession.currentQuestionTimer?.remainingSeconds ?? 0;

  return (
    <>
      {isPyodideLoading && <PyodideLoadingOverlay />}

      <WorkspaceChrome
        header={
          <WorkspaceHeader
            canGoNext={hasSelectedQuestion && activeQuestionIndex < practiceSession.questions.length - 1}
            canGoPrevious={hasSelectedQuestion && activeQuestionIndex > 0}
            canShuffle={hasSelectedQuestion && practiceSession.questions.length > 1}
            currentQuestionLabel={
              hasSelectedQuestion
                ? `Practice Workspace - Question ${practiceSession.currentQuestion.id} of ${practiceSession.questions.length}`
                : "Practice Workspace"
            }
            currentQuestionTitle={
              practiceSession.currentQuestion?.title || "Choose a question to begin"
            }
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onPrimaryAction={resultsDialog.open}
            onShuffleQuestion={handleShuffleQuestion}
            onToggleSidebar={sidebar.toggle}
            primaryActionLabel="View Progress"
            scoreLabel={`Score ${practiceSession.totalScore}/${practiceSession.maxPossibleScore}`}
            showShuffleButton
            timerLabel={
              hasSelectedQuestion ? `Timer ${formatTime(currentTimerSeconds)}` : "Select a problem"
            }
            timerTone={
              !hasSelectedQuestion
                ? "neutral"
                : isQuestionExpired || currentTimerSeconds <= 5 * 60
                ? "critical"
                : currentTimerSeconds <= 10 * 60
                ? "warning"
                : "neutral"
            }
          />
        }
        sidebar={
          <QuestionSidebar
            currentQuestionIndex={practiceSession.currentQuestionIndex}
            description="Pick any question. Selecting one opens it and closes this list."
            questions={sidebarQuestions}
            onSelectQuestion={handleSelectQuestion}
          />
        }
        sidebarVisible={sidebarVisible}
        sidebarClosing={sidebar.isClosing}
        onCloseSidebar={sidebar.close}
        problemPanel={
          <ProblemPanel
            question={practiceSession.currentQuestion}
            timer={practiceSession.currentQuestionTimer}
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
            isDisabled={!hasSelectedQuestion || isQuestionExpired}
            disabledMessage={interactionDisabledMessage}
          />
        }
        outputPanel={
          <OutputPanel
            results={results}
            mode={resultMode}
            question={practiceSession.currentQuestion}
            onRunCustom={handleRunCustom}
            isRunning={isRunning}
            isInteractionDisabled={!hasSelectedQuestion || isQuestionExpired}
            disableReason={customInputDisabledMessage}
          />
        }
      />

      {resultsDialog.isOpen && <PracticeResultsScreen onClose={resultsDialog.close} />}

      <Modal
        isOpen={resetDialog.isOpen}
        title="Reset Code"
        message="Reset to starter code? Your current draft for this question will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleResetConfirm}
        onCancel={resetDialog.close}
      />

      <WorkspaceToastHost />
    </>
  );
}
