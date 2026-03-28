"use client";

export default function ExamIntegrityOverlay({
  actionLabel,
  description,
  isOpen,
  onAction,
  title,
  warningCount,
  warningLimit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-[rgba(10,13,20,0.9)] px-6">
      <div className="w-full max-w-[520px] rounded-[28px] border border-accent-red/35 bg-bg-secondary p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-accent-red">
          Integrity Guard Active
        </div>
        <h2 className="mt-3 text-[1.9rem] font-bold text-text-primary">{title}</h2>
        <p className="mt-4 text-[0.94rem] leading-7 text-text-secondary">{description}</p>

        <div className="mt-6 rounded-2xl border border-border-main bg-bg-card px-4 py-4">
          <div className="text-[0.72rem] uppercase tracking-[0.12em] text-text-muted">
            Warning Count
          </div>
          <div className="mt-2 font-mono text-[2rem] font-bold text-accent-gold">
            {warningCount} / {warningLimit}
          </div>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-4 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
