"use client";

import Link from "next/link";
import { useMemo } from "react";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { formatQuestionDifficulty } from "@/lib/questions/questionCatalog.mjs";
import { buildPracticeSummary } from "@/lib/session/practiceSession.mjs";
import { usePracticeStore } from "@/providers/PracticeStoreProvider.jsx";

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

function StatCard({ label, value, summary }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="font-mono text-[1.6rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
      <p className="mt-2 text-[0.82rem] leading-6 text-text-secondary">{summary}</p>
    </div>
  );
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
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <WorkspacePageNavigation
        backHref="/exam"
        backLabel="Back to Exam"
        links={[
          { href: "/practice/progress", label: "View Progress", tone: "primary" },
          { href: "/results", label: "Results" },
        ]}
      />

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan">
            Practice Workspace
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            Browse every practice question from one persistent workspace
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            Practice keeps your drafts, best submissions, and progress summary inside
            one route-scoped workspace store. Each question still has its own URL, but
            the workspace stays mounted while you switch between problems.
          </p>

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
        </section>

        <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Practice Rules
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Flexible reps with persistent progress
          </h2>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
              Workspace Behavior
            </div>
            <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
              <li>Question switching updates the URL without remounting the workspace shell.</li>
              <li>Drafts save automatically and remain attached to the selected question.</li>
              <li>Best submissions are kept per question for progress tracking.</li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Saved Progress
            </div>
            <div className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              {hydrationStatus === "ready"
                ? "This device already has a synced practice workspace snapshot."
                : "The practice workspace is syncing its saved snapshot."}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {resumeQuestionId ? (
                <Link
                  href={`/practice/${resumeQuestionId}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                >
                  Resume Question {resumeQuestionId}
                </Link>
              ) : (
                <div className="text-[0.82rem] leading-6 text-text-secondary">
                  Open any question from the catalog to start building a saved
                  practice history.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-6 max-w-[1180px] overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-3 border-b border-border-subtle px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[1.1rem] font-semibold text-text-primary">
              Question Catalog
            </h2>
            <p className="mt-1 text-[0.82rem] text-text-secondary">
              Open any question instantly. The workspace persists while the content
              updates to the selected problem route.
            </p>
          </div>
          <div className="font-mono text-[0.78rem] text-text-muted">
            {summary.draftCount} saved draft{summary.draftCount === 1 ? "" : "s"}
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
                <th className="px-4 py-3">Best Score</th>
                <th className="px-4 py-3">Draft</th>
                <th className="px-6 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => {
                const questionSummary = summaryById.get(question.id) || null;
                const status = getStatusPresentation(questionSummary);
                const isCurrentQuestion = resumeQuestionId === question.id;

                return (
                  <tr
                    key={question.id}
                    className={`border-t border-border-subtle text-[0.84rem] transition-colors duration-200 hover:bg-bg-hover ${
                      isCurrentQuestion ? "bg-[rgba(77,124,255,0.08)]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-[0.74rem] text-text-muted">
                        Q{question.id}
                      </div>
                      <div className="mt-1 font-semibold text-text-primary">
                        {question.title}
                      </div>
                      <p className="mt-2 max-w-[46ch] text-[0.78rem] leading-6 text-text-secondary">
                        {question.scenario}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{question.topic}</td>
                    <td className="px-4 py-4 text-text-secondary">
                      {formatQuestionDifficulty(question.difficulty)}
                    </td>
                    <td className={`px-4 py-4 font-semibold ${status.tone}`}>
                      {status.label}
                    </td>
                    <td className="px-4 py-4 font-mono text-text-secondary">
                      {questionSummary
                        ? `${questionSummary.score}/${questionSummary.maxScore}`
                        : `0/${question.maxScore}`}
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {questionSummary?.hasDraft ? "Saved" : "None"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/practice/${question.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border-main px-3 py-2 text-[0.76rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-card"
                      >
                        {isCurrentQuestion ? "Resume" : "Open"}
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
