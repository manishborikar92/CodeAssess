"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { useExam } from "@/context/ExamContext";
import { useTimer } from "@/hooks/useTimer";

export default function Header({
  onViewResults,
  onQuestionTimeUp,
  pyodideReady,
  onToggleSidebar,
  isSidebarOpen,
}) {
  const {
    currentQuestion,
    currentQuestionIndex,
    currentQuestionTimer,
    maxPossibleScore,
    questions,
    totalScore,
  } = useExam();

  const timerLimitSeconds = currentQuestion?.timeLimitSeconds || 0;
  const [liveRemaining, setLiveRemaining] = useState(null);

  const onTick = useCallback(({ remaining: nextRemaining }) => {
    setLiveRemaining(nextRemaining);
  }, []);

  const { formatTime } = useTimer({
    durationSeconds: timerLimitSeconds,
    elapsedSeconds: currentQuestionTimer?.spentSeconds || 0,
    isRunning: currentQuestionTimer?.isRunning || false,
    onTick,
    onTimeUp: currentQuestion ? onQuestionTimeUp : undefined,
  });

  const remaining = currentQuestionTimer?.isRunning
    ? liveRemaining ?? currentQuestionTimer?.remainingSeconds ?? 0
    : currentQuestionTimer?.remainingSeconds || 0;
  const timerState = !currentQuestion
    ? ""
    : currentQuestionTimer?.isExpired || remaining <= 5 * 60
    ? "critical"
    : remaining <= 10 * 60
    ? "warning"
    : "";

  const questionLabel =
    currentQuestionIndex !== null && currentQuestion
      ? `Q ${currentQuestion.id} / ${questions.length}`
      : `Questions ${questions.length}`;

  return (
    <header className="flex items-center justify-between bg-bg-secondary border-b border-border-main px-4 gap-4 z-10 h-[52px] shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-hover rounded transition-colors cursor-pointer"
          title={isSidebarOpen ? "Close question list" : "Open question list"}
        >
          {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
        </button>

        <div className="flex items-center font-bold text-base tracking-wide whitespace-nowrap px-1">
          <Image
            src="/logo.svg"
            alt="CodeAssess"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-white tracking-wide font-bold">
            Code<span className="text-accent-cyan">Assess</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-5">
        <div className="flex items-center gap-1.5 bg-bg-card border border-border-main rounded-lg px-3.5 py-1 font-mono text-[0.82rem]">
          Score:
          <span className="text-accent-cyan font-semibold">{totalScore}</span>
          <span className="text-text-muted">/</span>
          <span>{maxPossibleScore}</span>
        </div>

        <div
          className={`
            flex items-center gap-2 bg-bg-card border rounded-lg px-3.5 py-1
            font-mono text-base font-semibold transition-all duration-200 min-w-[148px] justify-center
            ${
              !currentQuestion
                ? "border-border-main text-text-muted"
                : timerState === "critical"
                ? "border-accent-red text-accent-red animate-[blink_1s_infinite]"
                : timerState === "warning"
                ? "border-accent-gold text-accent-gold"
                : "border-border-main text-text-primary"
            }
          `}
        >
          <span className="text-[0.85rem]">T</span>
          <span>
            {!currentQuestion
              ? "Pick a question"
              : currentQuestionTimer?.isExpired
              ? "Time up"
              : formatTime(remaining)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-bg-card border border-border-main rounded-lg px-3.5 py-1 font-mono text-[0.78rem]">
          <span className="text-accent-blue font-semibold">{questionLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full mr-1 ${
            pyodideReady ? "bg-accent-green" : "bg-accent-gold animate-pulse"
          }`}
          title={pyodideReady ? "Python runtime ready" : "Loading Python runtime"}
        />

        <button
          onClick={onViewResults}
          className="px-3 py-1.5 text-[0.78rem] font-semibold text-text-secondary bg-transparent border border-border-main rounded hover:bg-bg-hover hover:text-text-primary transition-all duration-200 cursor-pointer"
        >
          View Progress
        </button>
      </div>
    </header>
  );
}
