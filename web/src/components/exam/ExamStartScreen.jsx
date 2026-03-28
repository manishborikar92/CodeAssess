"use client";

import Image from "next/image";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="font-mono text-[1.6rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
    </div>
  );
}

export default function ExamStartScreen({
  config,
  isStarting = false,
  onAcceptRulesChange,
  onStart,
  questions,
  rulesAccepted,
}) {
  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border-subtle bg-black/25 px-4 py-2">
            <Image
              src="/logo.svg"
              alt="CodeAssess"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-sm font-bold tracking-[0.16em] text-text-primary">
              CodeAssess
            </span>
            <span className="rounded-full border border-accent-gold/30 bg-accent-gold/10 px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-accent-gold">
              Exam Mode
            </span>
          </div>

          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan">
            Secure Coding Assessment
          </p>
          <h1 className="mt-3 max-w-[12ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            {config.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            {config.subtitle}. The exam runs in a focused browser session with a single
            shared timer. Candidates may switch between the selected questions at any
            time, and all drafts are preserved automatically within the session.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatCard label="Duration" value={`${config.durationMinutes} min`} />
            <StatCard label="Problems" value={config.totalQuestions} />
            <StatCard
              label="Warnings Before Auto-End"
              value={config.integrityPolicy.maxViolations}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border-main bg-black/20 p-5">
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
                Integrity Rules
              </div>
              <ul className="mt-4 space-y-3 text-[0.9rem] leading-6 text-text-secondary">
                <li>Stay on this page for the full exam. Tab switches are logged as warnings.</li>
                <li>Fullscreen is required while the exam is active. Exit events trigger warnings.</li>
                <li>Copy, cut, paste, and context-menu actions are blocked during the session.</li>
                <li>Reload and close attempts trigger a browser confirmation before leaving.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border-main bg-black/20 p-5">
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
                Exam Problems
              </div>
              <div className="mt-4 space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-3"
                  >
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                      Question {index + 1}
                    </div>
                    <div className="mt-1 text-base font-semibold text-text-primary">
                      {question.title}
                    </div>
                    <div className="mt-1 text-[0.82rem] text-text-secondary">
                      Section {question.section} | {question.topic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Before You Start
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Confirm the exam rules
          </h2>
          <p className="mt-3 text-[0.92rem] leading-7 text-text-secondary">
            Starting the assessment requests fullscreen mode and begins the
            non-pausing 90-minute timer immediately.
          </p>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Candidate Checklist
            </div>
            <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
              <li>Close unrelated tabs and apps before starting.</li>
              <li>Keep a single display connected for the duration of the exam.</li>
              <li>Use the problem list or arrow buttons to move between questions.</li>
              <li>Submit each question whenever you want to lock in your best score.</li>
            </ul>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-border-main bg-bg-card px-4 py-4">
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(event) => onAcceptRulesChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border-main bg-transparent accent-accent-blue"
            />
            <span className="text-[0.84rem] leading-6 text-text-secondary">
              I understand that leaving fullscreen, switching tabs, or attempting to
              copy and paste will be recorded as integrity warnings and may end the
              exam automatically.
            </span>
          </label>

          <button
            type="button"
            onClick={onStart}
            disabled={!rulesAccepted || isStarting}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-4 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isStarting ? "Launching Secure Exam..." : "Enter Fullscreen and Start"}
          </button>
        </aside>
      </div>
    </div>
  );
}
