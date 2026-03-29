"use client";

import Link from "next/link";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
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
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <div className="mx-auto max-w-[1180px]">
        <WorkspacePageNavigation
          backHref="/results"
          backLabel="Back to Results"
          links={[
            { href: "/exam", label: "Exam", tone: "primary" },
            { href: "/practice", label: "Practice" },
          ]}
        />

        <div className="rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(15,240,200,0.16),transparent_35%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-accent-cyan">
            Exam Summary
          </div>
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
            <div className="rounded-2xl border border-border-main bg-bg-card p-4">
              <div className="font-mono text-[1.6rem] font-bold text-accent-blue">
                {formatTime(totalDurationSeconds)}
              </div>
              <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
                Exam Duration
              </div>
            </div>

            <div className="rounded-2xl border border-border-main bg-bg-card p-4">
              <div className="font-mono text-[1.6rem] font-bold text-accent-blue">
                {session.integrity?.violations.length || 0}
              </div>
              <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
                Integrity Warnings
              </div>
            </div>

            <div className="rounded-2xl border border-border-main bg-bg-card p-4">
              <div className="font-mono text-[1.6rem] font-bold text-accent-blue">
                {accuracy}%
              </div>
              <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
                Accuracy
              </div>
            </div>

            <div className="rounded-2xl border border-border-main bg-bg-card p-4">
              <div className="font-mono text-[1.6rem] font-bold text-accent-blue">
                {submissions.length} / {questions.length}
              </div>
              <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
                Submitted Questions
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border border-border-main bg-bg-card p-5 text-[0.86rem] leading-6 text-text-secondary sm:grid-cols-3">
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
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <div className="grid grid-cols-[40px_1fr_90px_90px_110px] gap-3 bg-bg-tertiary px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-text-muted">
              <div>#</div>
              <div>Question</div>
              <div>Score</div>
              <div>Passed</div>
              <div>Status</div>
            </div>

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
                <div
                  key={question.id}
                  className="grid grid-cols-[40px_1fr_90px_90px_110px] items-center gap-3 border-t border-border-subtle px-4 py-3 text-[0.84rem]"
                >
                  <div className="font-mono text-text-muted">{question.id}</div>
                  <div>
                    <div className="font-semibold text-text-primary">{question.title}</div>
                    <div className="text-[0.74rem] text-text-muted">
                      {formatQuestionDifficulty(question.difficulty)} | {question.topic}
                    </div>
                  </div>
                  <div className="font-mono text-text-secondary">
                    {score}/{question.maxScore}
                  </div>
                  <div className="font-mono text-text-secondary">{passed}</div>
                  <div className={`text-[0.78rem] font-semibold ${statusClass}`}>
                    {statusLabel}
                  </div>
                </div>
              );
            })}
          </section>

          <aside className="self-start flex flex-col gap-3 rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            >
              {onResetLabel}
            </button>
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-4 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Open Practice Workspace
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-4 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Return Home
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
