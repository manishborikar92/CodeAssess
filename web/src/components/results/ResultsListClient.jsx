"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
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

function StatCard({ label, value, caption }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="font-mono text-[1.6rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
      <p className="mt-2 text-[0.82rem] leading-6 text-text-secondary">{caption}</p>
    </div>
  );
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
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <WorkspacePageNavigation
        backHref="/exam"
        backLabel="Back to Exam"
        links={[
          { href: "/join", label: "Join", tone: "primary" },
          { href: "/practice", label: "Practice" },
        ]}
      />

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan">
            Exam Results
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            Review every completed session stored on this device
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            Results are immutable snapshots of completed exam sessions. Active attempts
            remain under `/exam/[sessionId]` until the session lifecycle is finalized
            and written back into the results flow.
          </p>

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
        </section>

        <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Results Flow
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Completed sessions only
          </h2>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
              Latest Result
            </div>
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              {stats.latestFinishedAt}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Repository Scope
            </div>
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              Results are read from completed exam session snapshots only. Active
              attempts stay under `/exam/[sessionId]` until the session lifecycle is
              finalized.
            </p>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-6 max-w-[1180px] overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-3 border-b border-border-subtle px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[1.1rem] font-semibold text-text-primary">
              Completed Sessions
            </h2>
            <p className="mt-1 text-[0.82rem] text-text-secondary">
              Each row links to a session-driven result page keyed by `sessionId`.
            </p>
          </div>
          <div className="font-mono text-[0.78rem] text-text-muted">
            {results.length} saved session{results.length === 1 ? "" : "s"}
          </div>
        </div>

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
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-bg-tertiary text-left text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
                <tr>
                  <th className="px-6 py-3">Session</th>
                  <th className="px-4 py-3">Assessment</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Finished</th>
                  <th className="px-6 py-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {results.map((session) => (
                  <tr
                    key={session.id}
                    className="border-t border-border-subtle text-[0.84rem] transition-colors duration-200 hover:bg-bg-hover"
                  >
                    <td className="px-6 py-4 font-mono text-[0.76rem] text-text-muted">
                      {session.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-text-primary">
                        {session.assessment.title}
                      </div>
                      <div className="mt-1 text-[0.78rem] text-text-secondary">
                        {session.assessment.language.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {session.assessment.questionCount}
                    </td>
                    <td className="px-4 py-4 font-semibold text-text-primary">
                      {getFinishLabel(session.lifecycle.status)}
                    </td>
                    <td className="px-4 py-4 font-mono text-text-secondary">
                      {session.summary.totalScore}/{session.summary.maxScore}
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {formatDateTime(session.lifecycle.finishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/results/${session.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border-main px-3 py-2 text-[0.76rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-card"
                      >
                        View Result
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
