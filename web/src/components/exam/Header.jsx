"use client";

import { useExam } from "@/context/ExamContext";
import { useTimer } from "@/hooks/useTimer";
import { useState, useCallback } from "react";

export default function Header({ onFinishExam, onViewResults, pyodideReady }) {
  const {
    status,
    startTime,
    totalDuration,
    totalScore,
    maxPossibleScore,
    currentQuestionIndex,
    questions,
  } = useExam();

  const [remaining, setRemaining] = useState(totalDuration);
  const [timerState, setTimerState] = useState(""); // '' | 'warning' | 'critical'

  const onTick = useCallback(({ remaining: r }) => {
    setRemaining(r);
    if (r <= 300) setTimerState("critical");
    else if (r <= 900) setTimerState("warning");
    else setTimerState("");
  }, []);

  const { formatTime } = useTimer({
    startTime,
    totalSeconds: totalDuration,
    isRunning: status === "active",
    onTick,
    onTimeUp: onFinishExam,
  });

  const currentQ = questions[currentQuestionIndex];

  return (
    <header className="flex items-center justify-between bg-bg-secondary border-b border-border-main px-5 gap-4 z-10 h-[52px] shrink-0">
      {/* Brand */}
      <div className="flex items-center font-bold text-base tracking-wide whitespace-nowrap px-1">
        <img src="/logo.svg" alt="EvalCode" className="w-8 h-8 object-contain" />
        <span className="text-white tracking-wide font-bold">Code<span className="text-accent-cyan">Assess</span></span>
      </div>

      {/* Center: Score + Timer + Q counter */}
      <div className="flex-1 flex items-center justify-center gap-5">
        {/* Score */}
        <div className="flex items-center gap-1.5 bg-bg-card border border-border-main rounded-lg px-3.5 py-1 font-mono text-[0.82rem]">
          Score:{" "}
          <span className="text-accent-cyan font-semibold">{totalScore}</span>
          <span className="text-text-muted">/</span>
          <span>{maxPossibleScore}</span>
        </div>

        {/* Timer */}
        <div
          className={`
            flex items-center gap-2 bg-bg-card border rounded-lg px-3.5 py-1
            font-mono text-base font-semibold transition-all duration-200
            ${
              timerState === "critical"
                ? "border-accent-red text-accent-red animate-[blink_1s_infinite]"
                : timerState === "warning"
                ? "border-accent-gold text-accent-gold"
                : "border-border-main text-text-primary"
            }
          `}
        >
          <span className="text-[0.85rem]">⏱</span>
          <span>{formatTime(remaining)}</span>
        </div>

        {/* Question counter */}
        <div className="flex items-center gap-1.5 bg-bg-card border border-border-main rounded-lg px-3.5 py-1 font-mono text-[0.78rem]">
          Q <span className="text-accent-blue font-semibold">{currentQ?.id || 1}</span>
          <span className="text-text-muted">/</span>
          <span>{questions.length}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Pyodide indicator */}
        <div
          className={`w-2 h-2 rounded-full mr-1 ${
            pyodideReady ? "bg-accent-green" : "bg-accent-gold animate-pulse"
          }`}
          title={pyodideReady ? "Python runtime ready" : "Loading Python runtime..."}
        />

        {status === "finished" && (
          <button
            onClick={onViewResults}
            className="px-3 py-1.5 text-[0.78rem] font-semibold text-text-secondary bg-transparent border border-border-main rounded hover:bg-bg-hover hover:text-text-primary transition-all duration-200 cursor-pointer"
          >
            📊 Results
          </button>
        )}
        <button
          onClick={onFinishExam}
          disabled={status === "finished"}
          className="bg-gradient-to-br from-accent-green to-[#25a070] text-white border-none rounded px-4 py-1.5 text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⏹ End Exam
        </button>
      </div>
    </header>
  );
}
