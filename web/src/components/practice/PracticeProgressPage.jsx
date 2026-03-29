"use client";

import { useMemo } from "react";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { StatCard } from "@/components/ui/Card";
import { TableContainer, TableHeader, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "@/components/ui/Table";
import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, SectionTitle, SectionDescription, AsideTitle } from "@/components/ui/Section";
import { InfoPanel } from "@/components/ui/Panel";
import { WorkspaceLoadingScreen } from "@/components/workspace/WorkspaceLoadingStates.jsx";
import { LinkButton } from "@/components/ui/Button";
import { formatQuestionDifficulty } from "@/lib/questions/questionCatalog.mjs";
import { buildPracticeSummary } from "@/lib/session/practiceSession.mjs";
import { usePracticeStore } from "@/providers/PracticeStoreProvider.jsx";

function getStatusPresentation(question) {
  const percentage = question.maxScore > 0 ? question.score / question.maxScore : 0;

  if (percentage >= 1) {
    return {
      label: "Solved",
      tone: "text-accent-green",
    };
  }

  if (percentage > 0) {
    return {
      label: "Partial",
      tone: "text-accent-gold",
    };
  }

  if (question.hasDraft) {
    return {
      label: "In Progress",
      tone: "text-accent-blue",
    };
  }

  return {
    label: "Not Started",
    tone: "text-text-muted",
  };
}

export default function PracticeProgressPage() {
  const questions = usePracticeStore((state) => state.questions);
  const hydrationStatus = usePracticeStore((state) => state.hydrationStatus);
  const workspace = usePracticeStore((state) => state.workspace);

  const summary = useMemo(() => {
    if (!workspace) {
      return {
        attempted: 0,
        solved: 0,
        totalScore: 0,
        maxPossibleScore: questions.reduce(
          (sum, question) => sum + (question.maxScore || 0),
          0
        ),
        draftCount: 0,
        breakdown: [],
      };
    }

    return buildPracticeSummary({
      questions,
      drafts: workspace.workspace.draftsByQuestionId,
      submissions: workspace.workspace.submissionsByQuestionId,
    });
  }, [questions, workspace]);

  if (hydrationStatus !== "ready" || !workspace) {
    return <WorkspaceLoadingScreen label="Loading practice progress..." />;
  }

  const totalCases = summary.breakdown.reduce(
    (sum, question) => sum + (question.status ? question.status.total : 0),
    0
  );
  const totalPassed = summary.breakdown.reduce(
    (sum, question) => sum + (question.status ? question.status.passed : 0),
    0
  );
  const accuracy = totalCases > 0 ? Math.round((totalPassed / totalCases) * 100) : 0;
  const scorePercentage =
    summary.maxPossibleScore > 0
      ? Math.round((summary.totalScore / summary.maxPossibleScore) * 100)
      : 0;
  const resumeQuestionId = workspace.navigation.currentQuestionId;

  return (
    <PageContainer>
      <ContentWrapper>
        <WorkspacePageNavigation
          backHref="/practice"
          backLabel="Back to Practice"
          links={[
            {
              href: resumeQuestionId ? `/practice/${resumeQuestionId}` : "/practice",
              label: resumeQuestionId ? `Resume Q${resumeQuestionId}` : "Open Catalog",
              tone: "primary",
            },
            { href: "/results", label: "Results" },
            { href: "/exam", label: "Exam" },
          ]}
        />

        <TwoColumnLayout>
          <HeroCard>
            <SectionEyebrow>Practice Progress</SectionEyebrow>
            <SectionTitle>
              Review your saved practice progress from a single route
            </SectionTitle>
            <SectionDescription>
              The progress page reads directly from the scoped practice store. Scores,
              drafts, and best submissions remain attached to the same persistent
              workspace that powers `/practice/[id]`.
            </SectionDescription>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Solved"
                value={`${summary.solved}/${questions.length}`}
                caption="Questions completed with a full-score submission."
              />
              <StatCard
                label="Score"
                value={`${summary.totalScore}/${summary.maxPossibleScore}`}
                caption={`${scorePercentage}% of the available practice score has been captured.`}
              />
              <StatCard
                label="Accuracy"
                value={`${accuracy}%`}
                caption="Aggregate pass rate across submitted sample and hidden cases."
              />
            </div>
          </HeroCard>

          <SidePanel>
            <AsideTitle eyebrow="Workspace Snapshot">
              Everything stays tied to the same practice session
            </AsideTitle>

            <InfoPanel header="Current Totals" variant="card" className="mt-6">
              <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
                <li>{summary.attempted} questions have at least one saved submission.</li>
                <li>{summary.draftCount} questions have a draft in progress.</li>
                <li>{questions.length - summary.attempted} questions are still untouched.</li>
              </ul>
            </InfoPanel>

            <InfoPanel header="Resume Point" variant="card" className="mt-6">
              <div className="mt-3 flex flex-wrap gap-3">
                {resumeQuestionId ? (
                  <LinkButton href={`/practice/${resumeQuestionId}`} variant="primary">
                    Resume Question {resumeQuestionId}
                  </LinkButton>
                ) : (
                  <div className="text-[0.84rem] leading-6 text-text-secondary">
                    No question is currently selected. Open the practice catalog to
                    choose where to continue.
                  </div>
                )}
              </div>
            </InfoPanel>
          </SidePanel>
        </TwoColumnLayout>

        <TableContainer className="mt-6">
          <TableHeader
            title="Question Breakdown"
            description="Review question-by-question progress and jump back into any saved route."
          />

          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Question</TableHeaderCell>
                <TableHeaderCell>Topic</TableHeaderCell>
                <TableHeaderCell>Difficulty</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Score</TableHeaderCell>
                <TableHeaderCell>Draft</TableHeaderCell>
                <TableHeaderCell align="right">Action</TableHeaderCell>
              </tr>
          </TableHead>
          <TableBody>
            {summary.breakdown.map((question) => {
              const status = getStatusPresentation(question);

              return (
                <TableRow key={question.id}>
                  <TableCell className="px-6">
                    <div className="font-mono text-[0.74rem] text-text-muted">
                      Q{question.id}
                    </div>
                    <div className="mt-1 font-semibold text-text-primary">
                      {question.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">{question.topic}</TableCell>
                  <TableCell className="text-text-secondary">
                    {formatQuestionDifficulty(question.difficulty)}
                  </TableCell>
                  <TableCell className={`font-semibold ${status.tone}`}>
                    {status.label}
                  </TableCell>
                  <TableCell className="font-mono text-text-secondary">
                    {question.score}/{question.maxScore}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {question.hasDraft ? "Saved" : "None"}
                  </TableCell>
                  <TableCell align="right" className="px-6">
                    <Link
                      href={`/practice/${question.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-border-main px-3 py-2 text-[0.76rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-card"
                    >
                      Open
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </ContentWrapper>
    </PageContainer>
  );
}
