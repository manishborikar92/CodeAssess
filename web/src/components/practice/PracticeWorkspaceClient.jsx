"use client";

import { startTransition, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import { usePyodide } from "@/hooks/usePyodide";
import {
  getNextQuestionIndex,
  getPreviousQuestionIndex,
  getRandomQuestionIndex,
} from "@/lib/workspace/navigation.mjs";
import { usePracticeStore, usePracticeStoreApi } from "@/providers/PracticeStoreProvider.jsx";

import CodePanel from "../workspace/CodePanel.jsx";
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

export default function PracticeWorkspaceClient({ questionId }) {
  const router = useRouter();
  const practiceStoreApi = usePracticeStoreApi();
  const hydrationStatus = usePracticeStore((state) => state.hydrationStatus);
  const questions = usePracticeStore((state) => state.questions);
  const questionsById = usePracticeStore((state) => state.questionsById);
  const workspace = usePracticeStore((state) => state.workspace);

  const pyodide = usePyodide();
  const sidebar = useSidebarState();
  const resetDialog = useDialogState();
  const { isPyodideLoading } = usePyodideInitializer(pyodide, hydrationStatus !== "ready");

  useEffect(() => {
    if (hydrationStatus !== "ready") {
      return;
    }

    practiceStoreApi.getState().openQuestion(questionId).catch(() => {});
  }, [hydrationStatus, practiceStoreApi, questionId]);

  const currentQuestion = questionsById.get(questionId) || null;

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
    getDraft: (targetQuestionId, fallbackStarter) =>
      workspace?.workspace.draftsByQuestionId[targetQuestionId]?.code ??
      fallbackStarter ??
      "",
    saveDraft: (targetQuestionId, codeValue) =>
      practiceStoreApi.getState().saveDraft(targetQuestionId, codeValue),
  });

  const hasSelectedQuestion = Boolean(currentQuestion);
  const activeQuestionIndex = questions.findIndex((question) => question.id === questionId);

  const interactionDisabledMessage = !hasSelectedQuestion
    ? "Choose a question from the sidebar to start coding."
    : "";

  const customInputDisabledMessage = !hasSelectedQuestion
    ? "Choose a question from the sidebar before using custom input."
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
    isInteractionDisabled: !hasSelectedQuestion,
    pyodide,
    setResultMode,
    setResults,
    onSuccessfulSubmission: ({ code: submittedCode, questionId: targetQuestionId, result }) =>
      practiceStoreApi
        .getState()
        .recordSubmission(targetQuestionId, submittedCode, result),
  });

  useEffect(() => {
    if (hydrationStatus !== "ready") {
      return;
    }

    router.prefetch("/practice/progress");

    if (activeQuestionIndex < 0 || questions.length === 0) {
      return;
    }

    const previousQuestion =
      activeQuestionIndex > 0 ? questions[activeQuestionIndex - 1] : null;
    const nextQuestion =
      activeQuestionIndex < questions.length - 1
        ? questions[activeQuestionIndex + 1]
        : null;

    [previousQuestion, nextQuestion]
      .filter(Boolean)
      .forEach((question) => router.prefetch(`/practice/${question.id}`));
  }, [activeQuestionIndex, hydrationStatus, questions, router]);

  const navigateToRoute = useCallback(
    (href) => {
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [router]
  );

  const navigateToQuestionByIndex = useCallback(
    (nextIndex) => {
      const nextQuestion = questions[nextIndex];
      if (!nextQuestion) {
        return;
      }

      sidebar.close();
      navigateToRoute(`/practice/${nextQuestion.id}`);
    },
    [navigateToRoute, questions, sidebar]
  );

  const handlePreviousQuestion = useCallback(() => {
    if (activeQuestionIndex < 0) {
      return;
    }

    navigateToQuestionByIndex(
      getPreviousQuestionIndex(activeQuestionIndex, questions.length)
    );
  }, [activeQuestionIndex, navigateToQuestionByIndex, questions.length]);

  const handleNextQuestion = useCallback(() => {
    if (activeQuestionIndex < 0) {
      return;
    }

    navigateToQuestionByIndex(getNextQuestionIndex(activeQuestionIndex, questions.length));
  }, [activeQuestionIndex, navigateToQuestionByIndex, questions.length]);

  const handleShuffleQuestion = useCallback(() => {
    if (activeQuestionIndex < 0 || questions.length < 2) {
      return;
    }

    navigateToQuestionByIndex(
      getRandomQuestionIndex(activeQuestionIndex, questions.length)
    );
  }, [activeQuestionIndex, navigateToQuestionByIndex, questions.length]);

  const handleResetConfirm = useCallback(() => {
    resetToStarter();
    resetDialog.close();
  }, [resetDialog, resetToStarter]);

  const handleOpenProgress = useCallback(() => {
    navigateToRoute("/practice/progress");
  }, [navigateToRoute]);

  const sidebarQuestions = useMemo(() => {
    if (!workspace) {
      return questions.map((question) => ({
        ...question,
        status: "not-started",
        statusTitle: "Not started",
      }));
    }

    return questions.map((question) => {
      const submission = workspace.workspace.submissionsByQuestionId[question.id];
      const hasDraft =
        workspace.workspace.draftsByQuestionId[question.id] !== undefined;
      const isSolved = Boolean(submission && submission.score >= question.maxScore);
      const isPartial = Boolean(submission && submission.score > 0 && !isSolved);
      const isInProgress = !submission && hasDraft;

      let status = "not-started";
      let statusTitle = "Not started";

      if (isSolved) {
        status = "completed";
        statusTitle = `${submission.score}/${question.maxScore}`;
      } else if (isPartial) {
        status = "partial";
        statusTitle = `${submission.score}/${question.maxScore}`;
      } else if (isInProgress) {
        status = "in-progress";
        statusTitle = "Draft saved";
      }

      return {
        ...question,
        status,
        statusTitle,
      };
    });
  }, [questions, workspace]);

  if (hydrationStatus !== "ready" || !workspace) {
    return <WorkspaceLoadingScreen label="Loading practice workspace..." />;
  }

  const sidebarVisible = sidebar.isOpen || sidebar.isClosing;

  return (
    <>
      {isPyodideLoading && <PyodideLoadingOverlay />}

      <WorkspaceChrome
        header={
          <WorkspaceHeader
            canGoNext={activeQuestionIndex < questions.length - 1}
            canGoPrevious={activeQuestionIndex > 0}
            canShuffle={questions.length > 1}
            currentQuestionLabel={
              activeQuestionIndex >= 0
                ? `Practice Workspace - ${activeQuestionIndex + 1} of ${questions.length}`
                : "Practice Workspace"
            }
            currentQuestionTitle={currentQuestion?.title || "Choose a question to begin"}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onPrimaryAction={handleOpenProgress}
            onShuffleQuestion={handleShuffleQuestion}
            onToggleSidebar={sidebar.toggle}
            primaryActionLabel="View Progress"
            scoreLabel={`Score ${workspace.summary.totalScore}/${workspace.summary.maxScore}`}
            showShuffleButton
          />
        }
        sidebar={
          <QuestionSidebar
            currentQuestionIndex={activeQuestionIndex}
            description="Pick any question. Selecting one updates the route while keeping your live workspace mounted."
            questions={sidebarQuestions}
            onSelectQuestion={(index) => navigateToQuestionByIndex(index)}
            title="Practice Problems"
          />
        }
        sidebarVisible={sidebarVisible}
        sidebarClosing={sidebar.isClosing}
        onCloseSidebar={sidebar.close}
        problemPanel={
          <ProblemPanel
            question={currentQuestion}
            timeSummary="Drafts and best submissions are saved automatically while you practice."
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
            isDisabled={!hasSelectedQuestion}
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
            isInteractionDisabled={!hasSelectedQuestion}
            disableReason={customInputDisabledMessage}
          />
        }
      />

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
