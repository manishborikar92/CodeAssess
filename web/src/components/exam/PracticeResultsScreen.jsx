"use client";

import { useMemo } from "react";
import { usePracticeSession } from "@/context/PracticeSessionContext";

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}`;
}

export default function PracticeResultsScreen({ onClose }) {
  const { getSummary, questions } = usePracticeSession();
  const summary = useMemo(() => getSummary(), [getSummary]);

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

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-bg-primary animate-[fadeIn_0.3s_ease]">
      <div className="mx-auto max-w-[980px] px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-[2rem] font-extrabold text-text-primary">
            Practice Progress
          </h1>
          <p className="text-[0.85rem] text-text-muted">
            Current workspace snapshot across all questions
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-border-main bg-bg-card text-center shadow-[0_0_24px_rgba(77,124,255,0.15)] animate-[countUp_0.5s_ease]">
            <div className="font-mono text-[2.4rem] font-extrabold text-accent-blue">
              {summary.totalScore}
            </div>
            <div className="text-[0.9rem] text-text-muted">
              / {summary.maxPossibleScore} pts
            </div>
            <div className="mt-1 text-[0.72rem] text-text-muted">
              {scorePercentage}% scored
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-3">
          <div className="rounded-lg border border-border-main bg-bg-card p-[18px] text-center">
            <div className="font-mono text-[1.5rem] font-bold text-accent-cyan">
              {summary.solved}/{questions.length}
            </div>
            <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
              Solved
            </div>
          </div>

          <div className="rounded-lg border border-border-main bg-bg-card p-[18px] text-center">
            <div className="font-mono text-[1.5rem] font-bold text-accent-cyan">
              {summary.attempted}/{questions.length}
            </div>
            <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
              Attempted
            </div>
          </div>

          <div className="rounded-lg border border-border-main bg-bg-card p-[18px] text-center">
            <div className="font-mono text-[1.5rem] font-bold text-accent-cyan">
              {formatTime(summary.totalTimeSpent)}
            </div>
            <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
              Time Spent
            </div>
          </div>

          <div className="rounded-lg border border-border-main bg-bg-card p-[18px] text-center">
            <div className="font-mono text-[1.5rem] font-bold text-accent-cyan">
              {accuracy}%
            </div>
            <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
              Accuracy
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border-main bg-bg-secondary">
          <div className="grid grid-cols-[40px_1fr_80px_100px_110px_100px] gap-3 bg-bg-tertiary px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-text-muted">
            <div>#</div>
            <div>Question</div>
            <div>Section</div>
            <div>Score</div>
            <div>Timer</div>
            <div>Status</div>
          </div>

          {summary.breakdown.map((question) => {
            const percentage = question.maxScore > 0 ? question.score / question.maxScore : 0;
            const scoreClass = !question.attempted
              ? "text-text-muted"
              : percentage >= 1
              ? "text-accent-green"
              : percentage > 0
              ? "text-accent-gold"
              : "text-text-muted";

            let statusLabel = "Not started";
            let statusClass = "text-text-muted";

            if (percentage >= 1) {
              statusLabel = "Solved";
              statusClass = "text-accent-green";
            } else if (percentage > 0) {
              statusLabel = "Partial";
              statusClass = "text-accent-gold";
            } else if (question.timer.isExpired) {
              statusLabel = "Locked";
              statusClass = "text-accent-red";
            } else if (question.timer.hasStarted) {
              statusLabel = "In progress";
              statusClass = "text-accent-blue";
            }

            const timerLabel = question.timer.isExpired
              ? "Time up"
              : formatTime(question.timer.remainingSeconds);

            return (
              <div
                key={question.id}
                className="grid grid-cols-[40px_1fr_80px_100px_110px_100px] items-center gap-3 border-t border-border-subtle px-4 py-2.5 text-[0.82rem] transition-colors duration-200 hover:bg-bg-hover"
              >
                <div className="font-mono text-text-muted">{question.id}</div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.78rem] text-text-secondary">
                  {question.title}
                </div>
                <div className="text-[0.75rem] text-text-muted">S{question.section}</div>
                <div className={`font-mono font-semibold ${scoreClass}`}>
                  {question.score}/{question.maxScore}
                </div>
                <div className="font-mono text-[0.75rem] text-text-secondary">
                  {timerLabel}
                </div>
                <div className={`text-[0.75rem] ${statusClass}`}>{statusLabel}</div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-8 block w-full max-w-[320px] rounded-lg bg-gradient-to-br from-accent-blue to-[#3060d0] py-3.5 text-center text-base font-semibold text-white transition-all duration-200 hover:opacity-90"
        >
          Back to Workspace
        </button>
      </div>
    </div>
  );
}
