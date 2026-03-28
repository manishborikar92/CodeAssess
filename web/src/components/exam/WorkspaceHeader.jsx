"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Shuffle,
} from "lucide-react";

function HeaderIconButton({
  ariaLabel,
  disabled = false,
  icon: Icon,
  onClick,
  title,
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title || ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-transparent text-text-secondary transition-all duration-200 hover:border-border-bright hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Icon size={20} strokeWidth={2.1} />
    </button>
  );
}

function HeaderBadge({ tone = "neutral", value }) {
  const toneClass =
    tone === "critical"
      ? "border-accent-red text-accent-red"
      : tone === "warning"
      ? "border-accent-gold text-accent-gold"
      : tone === "success"
      ? "border-accent-green text-accent-green"
      : "border-border-main text-text-primary";

  return (
    <div
      className={`rounded-xl border bg-bg-card px-3 py-2 font-mono text-[0.8rem] font-semibold ${toneClass}`}
    >
      {value}
    </div>
  );
}

export default function WorkspaceHeader({
  currentQuestionLabel,
  currentQuestionTitle,
  integrityCount,
  onNextQuestion,
  onPreviousQuestion,
  onPrimaryAction,
  onShuffleQuestion,
  onToggleSidebar,
  primaryActionLabel,
  scoreLabel,
  showShuffleButton = false,
  timerLabel,
  timerTone = "neutral",
  canGoNext = false,
  canGoPrevious = false,
  canShuffle = false,
}) {
  return (
    <header className="flex h-[64px] items-center justify-between border-b border-border-main bg-bg-secondary px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-[#0d1220] px-3 py-2">
          <Image
            src="/logo.svg"
            alt="CodeAssess"
            width={26}
            height={26}
            className="h-[26px] w-[26px]"
          />
          <span className="text-sm font-bold tracking-wide text-text-primary">
            Code<span className="text-accent-cyan">Assess</span>
          </span>
        </div>

        <div className="h-8 w-px bg-border-subtle" />

        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center gap-3 rounded-xl border border-border-subtle bg-transparent px-4 py-2 text-[0.95rem] font-semibold text-text-primary transition-all duration-200 hover:border-border-bright hover:bg-bg-hover"
        >
          <List size={20} strokeWidth={2.1} className="text-text-secondary" />
          <span>Problems List</span>
        </button>

        <div className="flex items-center gap-2">
          <HeaderIconButton
            ariaLabel="Previous question"
            disabled={!canGoPrevious}
            icon={ChevronLeft}
            onClick={onPreviousQuestion}
          />
          <HeaderIconButton
            ariaLabel="Next question"
            disabled={!canGoNext}
            icon={ChevronRight}
            onClick={onNextQuestion}
          />
          {showShuffleButton && (
            <HeaderIconButton
              ariaLabel="Random question"
              disabled={!canShuffle}
              icon={Shuffle}
              onClick={onShuffleQuestion}
            />
          )}
        </div>
      </div>

      <div className="mx-4 min-w-0 flex-1">
        <div className="truncate text-[0.72rem] uppercase tracking-[1.6px] text-text-muted">
          {currentQuestionLabel}
        </div>
        <div className="truncate text-base font-semibold text-text-primary">
          {currentQuestionTitle}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {integrityCount !== null && integrityCount !== undefined && (
          <HeaderBadge
            tone={integrityCount > 0 ? "warning" : "neutral"}
            value={`Warnings ${integrityCount}`}
          />
        )}
        {scoreLabel && <HeaderBadge value={scoreLabel} />}
        {timerLabel && <HeaderBadge tone={timerTone} value={timerLabel} />}
        {primaryActionLabel && (
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-4 py-2 text-[0.82rem] font-semibold text-white transition-all duration-200 hover:opacity-90"
          >
            {primaryActionLabel}
          </button>
        )}
      </div>
    </header>
  );
}
