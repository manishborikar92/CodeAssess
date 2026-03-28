"use client";

import { useMemo } from "react";
import { useExam } from "@/context/ExamContext";

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

export default function ResultsScreen({ onClose }) {
  const { getSummary, questions } = useExam();
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
  const scorePct =
    summary.maxPossibleScore > 0
      ? Math.round((summary.totalScore / summary.maxPossibleScore) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-[300] bg-bg-primary overflow-y-auto animate-[fadeIn_0.3s_ease]">
      <div className="max-w-[980px] mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-[2rem] font-extrabold mb-2 text-text-primary">
            Practice Progress
          </h1>
          <p className="text-text-muted text-[0.85rem]">
            Current workspace snapshot across all questions
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div
            className="text-center bg-bg-card border border-border-main rounded-full
            w-40 h-40 flex flex-col items-center justify-center
            shadow-[0_0_24px_rgba(77,124,255,0.15)]
            animate-[countUp_0.5s_ease]"
          >
            <div className="text-[2.4rem] font-extrabold text-accent-blue font-mono">
              {summary.totalScore}
            </div>
            <div className="text-[0.9rem] text-text-muted">
              / {summary.maxPossibleScore} pts
            </div>
            <div className="text-[0.72rem] text-text-muted mt-1">{scorePct}% scored</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-bg-card border border-border-main rounded-lg p-[18px] text-center">
            <div className="text-[1.5rem] font-bold font-mono text-accent-cyan">
              {summary.solved}/{questions.length}
            </div>
            <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
              Solved
            </div>
          </div>

          <div className="bg-bg-card border border-border-main rounded-lg p-[18px] text-center">
            <div className="text-[1.5rem] font-bold font-mono text-accent-cyan">
              {summary.attempted}/{questions.length}
            </div>
            <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
              Attempted
            </div>
          </div>

          <div className="bg-bg-card border border-border-main rounded-lg p-[18px] text-center">
            <div className="text-[1.5rem] font-bold font-mono text-accent-cyan">
              {formatTime(summary.totalTimeSpent)}
            </div>
            <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
              Time Spent
            </div>
          </div>

          <div className="bg-bg-card border border-border-main rounded-lg p-[18px] text-center">
            <div className="text-[1.5rem] font-bold font-mono text-accent-cyan">
              {accuracy}%
            </div>
            <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
              Accuracy
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-main rounded-lg overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_80px_100px_110px_100px] gap-3 px-4 py-2.5 bg-bg-tertiary text-[0.68rem] uppercase tracking-[1.5px] text-text-muted font-semibold">
            <div>#</div>
            <div>Question</div>
            <div>Section</div>
            <div>Score</div>
            <div>Timer</div>
            <div>Status</div>
          </div>

          {summary.breakdown.map((question) => {
            const pct = question.maxScore > 0 ? question.score / question.maxScore : 0;
            const scoreClass = !question.attempted
              ? "text-text-muted"
              : pct >= 1
              ? "text-accent-green"
              : pct > 0
              ? "text-accent-gold"
              : "text-text-muted";

            let statusLabel = "Not started";
            let statusClass = "text-text-muted";

            if (pct >= 1) {
              statusLabel = "Solved";
              statusClass = "text-accent-green";
            } else if (pct > 0) {
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
                className="grid grid-cols-[40px_1fr_80px_100px_110px_100px] gap-3 px-4 py-2.5
                  border-t border-border-subtle items-center text-[0.82rem]
                  hover:bg-bg-hover transition-colors duration-200"
              >
                <div className="font-mono text-text-muted">{question.id}</div>
                <div className="text-[0.78rem] text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                  {question.title}
                </div>
                <div className="text-[0.75rem] text-text-muted">S{question.section}</div>
                <div className={`font-mono font-semibold ${scoreClass}`}>
                  {question.score}/{question.maxScore}
                </div>
                <div className="text-[0.75rem] text-text-secondary font-mono">
                  {timerLabel}
                </div>
                <div className={`text-[0.75rem] ${statusClass}`}>{statusLabel}</div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="block w-full max-w-[320px] mx-auto mt-8
            bg-gradient-to-br from-accent-blue to-[#3060d0]
            text-white border-none rounded-lg py-3.5 text-base font-semibold
            cursor-pointer text-center hover:opacity-90 transition-all duration-200"
        >
          Back to Workspace
        </button>
      </div>
    </div>
  );
}
