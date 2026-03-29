"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { StatCard } from "@/components/ui/Card";
import { TableContainer, TableHeader, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "@/components/ui/Table";
import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, SectionTitle, SectionDescription, AsideTitle } from "@/components/ui/Section";
import { InfoPanel } from "@/components/ui/Panel";
import { LinkButton } from "@/components/ui/Button";
import { formatQuestionDifficulty } from "@/lib/questions/questionCatalog.mjs";
import { buildPracticeSummary } from "@/lib/session/practiceSession.mjs";
import { usePracticeStore } from "@/providers/PracticeStoreProvider.jsx";
import { Badge } from "@/components/ui/Badge";

function getStatusPresentation(questionSummary) {
  if (!questionSummary) {
    return {
      label: "Not Started",
      tone: "text-text-muted",
    };
  }

  if (questionSummary.score >= questionSummary.maxScore) {
    return {
      label: "Solved",
      tone: "text-accent-green",
    };
  }

  if (questionSummary.score > 0) {
    return {
      label: "Partial",
      tone: "text-accent-gold",
    };
  }

  if (questionSummary.hasDraft) {
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

export default function PracticeQuestionBrowser({ questions }) {
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

  const summaryById = useMemo(
    () => new Map(summary.breakdown.map((item) => [item.id, item])),
    [summary.breakdown]
  );

  const resumeQuestionId = workspace?.navigation.currentQuestionId || null;
  const scorePercentage =
    summary.maxPossibleScore > 0
      ? Math.round((summary.totalScore / summary.maxPossibleScore) * 100)
      : 0;

  return (
    <PageContainer>
      <ContentWrapper>
        <WorkspacePageNavigation
          backHref="/exam"
          backLabel="Back to Exam"
          links={[
            { href: "/practice/progress", label: "View Progress", tone: "primary" },
            { href: "/results", label: "Results" },
          ]}
        />

        <TwoColumnLayout>
          <HeroCard>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border-subtle bg-black/25 px-4 py-2">
              <Image
                src="/logo.svg"
                alt="CodeAssess"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="text-sm font-bold tracking-[0.16em] text-text-primary">
                CodeAssess
              </span>
              <Badge variant="small" tone="gold">
                Practice Mode
              </Badge>
            </div>
            <SectionEyebrow>Practice Workspace</SectionEyebrow>
            <SectionTitle>
              Browse every practice question from one persistent workspace
            </SectionTitle>
            <SectionDescription>
              Practice keeps your drafts, best submissions, and progress summary inside
              one route-scoped workspace store. Each question still has its own URL, but
              the workspace stays mounted while you switch between problems.
            </SectionDescription>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Catalog"
                value={questions.length}
                summary="Full public question pool available for open practice."
              />
              <StatCard
                label="Solved"
                value={`${summary.solved}/${questions.length}`}
                summary="Questions with a full-score submission saved in the practice store."
              />
              <StatCard
                label="Score"
                value={`${summary.totalScore}/${summary.maxPossibleScore}`}
                summary={`${scorePercentage}% of the available practice score has been captured.`}
              />
            </div>
          </HeroCard>

          <SidePanel>
            <AsideTitle eyebrow="Practice Rules">
              Flexible reps with persistent progress
            </AsideTitle>

            <InfoPanel header="Workspace Behavior" variant="card" className="mt-6">
              <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
                <li>Question switching updates the URL without remounting the workspace shell.</li>
                <li>Drafts save automatically and remain attached to the selected question.</li>
                <li>Best submissions are kept per question for progress tracking.</li>
              </ul>
            </InfoPanel>

            <InfoPanel header="Saved Progress" variant="card" className="mt-6">
              <div className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
                {hydrationStatus === "ready"
                  ? "This device already has a synced practice workspace snapshot."
                  : "The practice workspace is syncing its saved snapshot."}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {resumeQuestionId ? (
                  <LinkButton href={`/practice/${resumeQuestionId}`} variant="primary">
                    Resume Question {resumeQuestionId}
                  </LinkButton>
                ) : (
                  <div className="text-[0.82rem] leading-6 text-text-secondary">
                    Open any question from the catalog to start building a saved
                    practice history.
                  </div>
                )}
              </div>
            </InfoPanel>
          </SidePanel>
        </TwoColumnLayout>

        <TableContainer className="mt-6">
          <TableHeader
            title="Question Catalog"
            description="Open any question instantly. The workspace persists while the content updates to the selected problem route."
            metadata={`${summary.draftCount} saved draft${summary.draftCount === 1 ? "" : "s"}`}
          />

          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Question</TableHeaderCell>
                <TableHeaderCell>Topic</TableHeaderCell>
                <TableHeaderCell>Difficulty</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Best Score</TableHeaderCell>
                <TableHeaderCell>Draft</TableHeaderCell>
                <TableHeaderCell align="right">Open</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {questions.map((question) => {
                const questionSummary = summaryById.get(question.id) || null;
                const status = getStatusPresentation(questionSummary);
                const isCurrentQuestion = resumeQuestionId === question.id;

                return (
                  <TableRow key={question.id} isHighlighted={isCurrentQuestion}>
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
                      {questionSummary
                        ? `${questionSummary.score}/${questionSummary.maxScore}`
                        : `0/${question.maxScore}`}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {questionSummary?.hasDraft ? "Saved" : "None"}
                    </TableCell>
                    <TableCell align="right" className="px-6">
                      <Link
                        href={`/practice/${question.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border-main px-3 py-2 text-[0.76rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-card"
                      >
                        {isCurrentQuestion ? "Resume" : "Open"}
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
