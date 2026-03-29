"use client";

import Link from "next/link";
import { useMemo } from "react";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { WorkspaceLoadingScreen } from "@/components/workspace/WorkspaceLoadingStates.jsx";
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
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
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

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan">
            Practice Progress
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            Review your saved practice progress from a single route
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            The progress page reads directly from the scoped practice store. Scores,
            drafts, and best submissions remain attached to the same persistent
            workspace that powers `/practice/[id]`.
          </p>

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
        </section>

        <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Workspace Snapshot
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Everything stays tied to the same practice session
          </h2>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
              Current Totals
            </div>
            <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
              <li>{summary.attempted} questions have at least one saved submission.</li>
              <li>{summary.draftCount} questions have a draft in progress.</li>
              <li>{questions.length - summary.attempted} questions are still untouched.</li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Resume Point
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {resumeQuestionId ? (
                <Link
                  href={`/practice/${resumeQuestionId}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                >
                  Resume Question {resumeQuestionId}
                </Link>
              ) : (
                <div className="text-[0.84rem] leading-6 text-text-secondary">
                  No question is currently selected. Open the practice catalog to
                  choose where to continue.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-6 max-w-[1180px] overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-6 py-4">
          <div>
            <h2 className="text-[1.1rem] font-semibold text-text-primary">
              Question Breakdown
            </h2>
            <p className="mt-1 text-[0.82rem] text-text-secondary">
              Review question-by-question progress and jump back into any saved route.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-bg-tertiary text-left text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
              <tr>
                <th className="px-6 py-3">Question</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Draft</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {summary.breakdown.map((question) => {
                const status = getStatusPresentation(question);

                return (
                  <tr
                    key={question.id}
                    className="border-t border-border-subtle text-[0.84rem] transition-colors duration-200 hover:bg-bg-hover"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-[0.74rem] text-text-muted">
                        Q{question.id}
                      </div>
                      <div className="mt-1 font-semibold text-text-primary">
                        {question.title}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{question.topic}</td>
                    <td className="px-4 py-4 text-text-secondary">
                      {formatQuestionDifficulty(question.difficulty)}
                    </td>
                    <td className={`px-4 py-4 font-semibold ${status.tone}`}>
                      {status.label}
                    </td>
                    <td className="px-4 py-4 font-mono text-text-secondary">
                      {question.score}/{question.maxScore}
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {question.hasDraft ? "Saved" : "None"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/practice/${question.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border-main px-3 py-2 text-[0.76rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-card"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
