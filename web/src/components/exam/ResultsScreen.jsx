"use client";

import { useExam } from "@/context/ExamContext";
import { useTimer } from "@/hooks/useTimer";
import { useMemo } from "react";

export default function ResultsScreen({ onClose }) {
  const { getSummary, questions, totalDuration } = useExam();

  const summary = useMemo(() => getSummary(), [getSummary]);
  const { formatTime } = useTimer({
    startTime: null,
    totalSeconds: 0,
    isRunning: false,
  });

  const totalCases = summary.breakdown.reduce(
    (s, q) => s + (q.status ? q.status.total : 0),
    0
  );
  const totalPassed = summary.breakdown.reduce(
    (s, q) => s + (q.status ? q.status.passed : 0),
    0
  );
  const accuracy =
    totalCases > 0 ? Math.round((totalPassed / totalCases) * 100) : 0;

  const scorePct =
    summary.maxPossibleScore > 0
      ? Math.round((summary.totalScore / summary.maxPossibleScore) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-[300] bg-bg-primary overflow-y-auto animate-[fadeIn_0.3s_ease]">
      <div className="max-w-[860px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[2rem] font-extrabold mb-2 text-text-primary">
            Exam Complete 🎉
          </h1>
          <p className="text-text-muted text-[0.85rem]">
            Coding Assessment · Results
          </p>
        </div>

        {/* Score Ring */}
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
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
              {formatTime(Math.min(summary.elapsed, totalDuration))}
            </div>
            <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
              Time Taken
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

        {/* Breakdown Table */}
        <div className="bg-bg-secondary border border-border-main rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_80px_100px_80px] gap-3 px-4 py-2.5 bg-bg-tertiary text-[0.68rem] uppercase tracking-[1.5px] text-text-muted font-semibold">
            <div>#</div>
            <div>Question</div>
            <div>Section</div>
            <div>Score</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          {summary.breakdown.map((q) => {
            const pct = q.maxScore > 0 ? q.score / q.maxScore : 0;
            const cls = !q.attempted
              ? "text-text-muted"
              : pct >= 1
              ? "text-accent-green"
              : pct > 0
              ? "text-accent-gold"
              : "text-text-muted";
            const statusLabel = !q.attempted
              ? "–"
              : pct >= 1
              ? "✓ AC"
              : pct > 0
              ? "~ Partial"
              : "✗ WA";
            const statusColor = !q.attempted
              ? "text-text-muted"
              : pct >= 1
              ? "text-accent-green"
              : pct > 0
              ? "text-accent-gold"
              : "text-accent-red";

            return (
              <div
                key={q.id}
                className="grid grid-cols-[40px_1fr_80px_100px_80px] gap-3 px-4 py-2.5
                  border-t border-border-subtle items-center text-[0.82rem]
                  hover:bg-bg-hover transition-colors duration-200"
              >
                <div className="font-mono text-text-muted">{q.id}</div>
                <div className="text-[0.78rem] text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                  {q.title}
                </div>
                <div className="text-[0.75rem] text-text-muted">§{q.section}</div>
                <div className={`font-mono font-semibold ${cls}`}>
                  {q.score}/{q.maxScore}
                </div>
                <div className={`text-[0.75rem] ${statusColor}`}>
                  {statusLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back button */}
        <button
          onClick={onClose}
          className="block w-full max-w-[300px] mx-auto mt-8
            bg-gradient-to-br from-accent-blue to-[#3060d0]
            text-white border-none rounded-lg py-3.5 text-base font-semibold
            cursor-pointer text-center hover:opacity-90 transition-all duration-200"
        >
          ← Back to Exam
        </button>
      </div>
    </div>
  );
}
