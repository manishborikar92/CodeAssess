"use client";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { StatCard } from "@/components/ui/Card";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "@/components/ui/Table";
import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow } from "@/components/ui/Section";
import { InfoPanel } from "@/components/ui/Panel";
import { Button, LinkButton } from "@/components/ui/Button";
import { formatQuestionDifficulty } from "@/lib/questions/questionCatalog.mjs";

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function getFinishLabel(finishReason) {
  switch (finishReason) {
    case "time-limit":
      return "Time Limit Reached";
    case "integrity-limit":
      return "Ended by Integrity Policy";
    default:
      return "Completed";
  }
}

export default function ExamResultsScreen({
  onReset,
  onResetLabel = "Start Fresh Exam",
  questions,
  session,
  totalDurationSeconds,
}) {
  const submissions = Object.values(session.workspace?.submissionsByQuestionId || {});
  const totalScore = submissions.reduce(
    (sum, submission) => sum + (submission.score || 0),
    0
  );
  const maxScore = questions.reduce((sum, question) => sum + question.maxScore, 0);
  const totalPassed = submissions.reduce(
    (sum, submission) => sum + (submission.passed || 0),
    0
  );
  const totalCases = submissions.reduce(
    (sum, submission) => sum + (submission.total || 0),
    0
  );
  const accuracy = totalCases > 0 ? Math.round((totalPassed / totalCases) * 100) : 0;
  const startedAt = session.lifecycle?.startedAt
    ? new Date(session.lifecycle.startedAt).toLocaleString()
    : "-";
  const finishedAt = session.lifecycle?.finishedAt
    ? new Date(session.lifecycle.finishedAt).toLocaleString()
    : "-";

  return (
    <PageContainer>
      <ContentWrapper>
        <WorkspacePageNavigation
          backHref="/results"
          backLabel="Back to Results"
          links={[
            { href: "/exam", label: "Exam", tone: "primary" },
            { href: "/practice", label: "Practice" },
          ]}
        />

        <HeroCard variant="cyan">
          <SectionEyebrow>Exam Summary</SectionEyebrow>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[clamp(2.4rem,4vw,3.5rem)] font-extrabold text-text-primary">
                {getFinishLabel(session.lifecycle?.finishReason)}
              </h1>
              <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-text-secondary">
                Review the session outcome, integrity warnings, and per-question
                scores below. This page stays available after refresh so the current
                demo flow mirrors a persisted exam session.
              </p>
            </div>

            <div className="rounded-2xl border border-border-main bg-black/25 px-5 py-4">
              <div className="text-[0.72rem] uppercase tracking-[0.12em] text-text-muted">
                Final Score
              </div>
              <div className="mt-2 font-mono text-[2.2rem] font-bold text-accent-cyan">
                {totalScore} / {maxScore}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <StatCard label="Exam Duration" value={formatTime(totalDurationSeconds)} />
            <StatCard label="Integrity Warnings" value={session.integrity?.violations.length || 0} />
            <StatCard label="Accuracy" value={`${accuracy}%`} />
            <StatCard label="Submitted Questions" value={`${submissions.length} / ${questions.length}`} />
          </div>

          <InfoPanel variant="card" className="mt-6">
            <div className="grid gap-4 text-[0.86rem] leading-6 text-text-secondary sm:grid-cols-3">
              <div>
                <div className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
                  Started
                </div>
                <div className="mt-1">{startedAt}</div>
              </div>
              <div>
                <div className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
                  Finished
                </div>
                <div className="mt-1">{finishedAt}</div>
              </div>
              <div>
                <div className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
                  Integrity Notes
                </div>
                <div className="mt-1">
                  {session.integrity?.violations.length === 0
                    ? "No warnings recorded during this session."
                    : `${session.integrity?.violations.length || 0} warning(s) recorded.`}
                </div>
              </div>
            </div>
          </InfoPanel>
        </HeroCard>

        <TwoColumnLayout variant="wide" className="mt-6">
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell>Question</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                  <TableHeaderCell>Passed</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {questions.map((question) => {
                  const submission = session.workspace?.submissionsByQuestionId?.[question.id];
                  const score = submission?.score || 0;
                  const passed = submission ? `${submission.passed}/${submission.total}` : "-";
                  const percentage = question.maxScore > 0 ? score / question.maxScore : 0;
                  const statusLabel = !submission
                    ? "Not submitted"
                    : percentage >= 1
                    ? "Solved"
                    : percentage > 0
                    ? "Partial"
                    : "Needs work";
                  const statusClass = !submission
                    ? "text-text-muted"
                    : percentage >= 1
                    ? "text-accent-green"
                    : percentage > 0
                    ? "text-accent-gold"
                    : "text-accent-red";

                  return (
                    <TableRow key={question.id}>
                      <TableCell className="font-mono text-text-muted">{question.id}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-text-primary">{question.title}</div>
                        <div className="text-[0.74rem] text-text-muted">
                          {formatQuestionDifficulty(question.difficulty)} | {question.topic}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-text-secondary">
                        {score}/{question.maxScore}
                      </TableCell>
                      <TableCell className="font-mono text-text-secondary">{passed}</TableCell>
                      <TableCell className={`text-[0.78rem] font-semibold ${statusClass}`}>
                        {statusLabel}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <SidePanel className="flex flex-col gap-3">
            <Button variant="primary" onClick={onReset}>
              {onResetLabel}
            </Button>
            <LinkButton href="/practice" variant="secondary">
              Open Practice Workspace
            </LinkButton>
            <LinkButton href="/" variant="secondary">
              Return Home
            </LinkButton>
          </SidePanel>
        </TwoColumnLayout>
      </ContentWrapper>
    </PageContainer>
  );
}
