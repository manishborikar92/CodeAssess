"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { StatCard } from "@/components/ui/Card";
import { TableContainer, TableHeader, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "@/components/ui/Table";
import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, SectionTitle, SectionDescription, AsideTitle } from "@/components/ui/Section";
import { InfoPanel } from "@/components/ui/Panel";
import { WorkspaceLoadingScreen } from "../workspace/WorkspaceLoadingStates.jsx";
import { examSessionRepository } from "../../lib/repositories/examSessionRepository.js";

function getFinishLabel(status) {
  switch (status) {
    case "time-limit":
      return "Time Limit";
    case "integrity-limit":
      return "Integrity Limit";
    default:
      return "Completed";
  }
}

function formatDateTime(value) {
  if (!value) {
    return "Pending";
  }

  return new Date(value).toLocaleString();
}

export default function ResultsListClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const completed = await examSessionRepository.listCompleted();
      if (!cancelled) {
        setResults(completed);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        completedCount: 0,
        averagePercentage: 0,
        bestScore: "0/0",
        latestFinishedAt: "No saved sessions",
      };
    }

    const percentages = results.map((session) =>
      session.summary.maxScore > 0
        ? Math.round((session.summary.totalScore / session.summary.maxScore) * 100)
        : 0
    );
    const averagePercentage = Math.round(
      percentages.reduce((sum, percentage) => sum + percentage, 0) / results.length
    );
    const bestSession = results.reduce((best, session) => {
      if (!best) {
        return session;
      }

      const bestPercentage =
        best.summary.maxScore > 0
          ? best.summary.totalScore / best.summary.maxScore
          : 0;
      const sessionPercentage =
        session.summary.maxScore > 0
          ? session.summary.totalScore / session.summary.maxScore
          : 0;

      return sessionPercentage > bestPercentage ? session : best;
    }, null);

    return {
      completedCount: results.length,
      averagePercentage,
      bestScore: `${bestSession.summary.totalScore}/${bestSession.summary.maxScore}`,
      latestFinishedAt: formatDateTime(results[0]?.lifecycle?.finishedAt),
    };
  }, [results]);

  if (isLoading) {
    return <WorkspaceLoadingScreen label="Loading saved exam results..." />;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <WorkspacePageNavigation
          backHref="/exam"
          backLabel="Back to Exam"
          links={[
            { href: "/join", label: "Join", tone: "primary" },
            { href: "/practice", label: "Practice" },
          ]}
        />

        <TwoColumnLayout>
          <HeroCard>
            <SectionEyebrow>Exam Results</SectionEyebrow>
            <SectionTitle>
              Review every completed session stored on this device
            </SectionTitle>
            <SectionDescription>
              Results are immutable snapshots of completed exam sessions. Active attempts
              remain under `/exam/[sessionId]` until the session lifecycle is finalized
              and written back into the results flow.
            </SectionDescription>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Completed"
                value={String(stats.completedCount)}
                caption="Finished exam sessions available in the local repository."
              />
              <StatCard
                label="Average"
                value={`${stats.averagePercentage}%`}
                caption="Average score percentage across completed attempts."
              />
              <StatCard
                label="Best Score"
                value={stats.bestScore}
                caption="Highest scoring completed session on this device."
              />
            </div>
          </HeroCard>

          <SidePanel>
            <AsideTitle eyebrow="Results Flow">
              Completed sessions only
            </AsideTitle>

            <InfoPanel header="Latest Result" variant="card" className="mt-6">
              <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
                {stats.latestFinishedAt}
              </p>
            </InfoPanel>

            <InfoPanel header="Repository Scope" variant="card" className="mt-6">
              <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
                Results are read from completed exam session snapshots only. Active
                attempts stay under `/exam/[sessionId]` until the session lifecycle is
                finalized.
              </p>
            </InfoPanel>
          </SidePanel>
        </TwoColumnLayout>

        <TableContainer className="mt-6">
          <TableHeader
            title="Completed Sessions"
            description="Each row links to a session-driven result page keyed by `sessionId`."
            metadata={`${results.length} saved session${results.length === 1 ? "" : "s"}`}
          />

          {results.length === 0 ? (
            <div className="px-6 py-8 text-text-secondary">
              No completed exam sessions have been saved on this device yet. Start an
              exam from the{" "}
              <Link href="/exam" className="font-semibold text-accent-blue">
                exam lobby
              </Link>{" "}
              to create your first completed result.
            </div>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Session</TableHeaderCell>
                  <TableHeaderCell>Assessment</TableHeaderCell>
                  <TableHeaderCell>Questions</TableHeaderCell>
                  <TableHeaderCell>Outcome</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                  <TableHeaderCell>Finished</TableHeaderCell>
                  <TableHeaderCell align="right">Open</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {results.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="px-6 font-mono text-[0.76rem] text-text-muted">
                      {session.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-text-primary">
                        {session.assessment.title}
                      </div>
                      <div className="mt-1 text-[0.78rem] text-text-secondary">
                        {session.assessment.language.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {session.assessment.questionCount}
                    </TableCell>
                    <TableCell className="font-semibold text-text-primary">
                      {getFinishLabel(session.lifecycle.status)}
                    </TableCell>
                    <TableCell className="font-mono text-text-secondary">
                      {session.summary.totalScore}/{session.summary.maxScore}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {formatDateTime(session.lifecycle.finishedAt)}
                    </TableCell>
                    <TableCell align="right" className="px-6">
                      <Link
                        href={`/results/${session.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border-main px-3 py-2 text-[0.76rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-card"
                      >
                        View Result
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </ContentWrapper>
    </PageContainer>
  );
}
