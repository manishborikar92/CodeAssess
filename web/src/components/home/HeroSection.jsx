import Link from "next/link";

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card/80 p-4">
      <div className="font-mono text-[1.7rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
    </div>
  );
}

export default function HeroSection({ examConfig, practiceConfig }) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24 md:pt-34">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,240,200,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1.15fr)_440px]">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-[rgba(15,240,200,0.08)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent-cyan">
            Built for modern coding assessments
          </div>

          <h1 className="mt-6 max-w-[12ch] text-[clamp(3.2rem,7vw,5.6rem)] font-extrabold leading-[0.92] text-text-primary">
            Practice freely.
            <span className="block text-accent-blue">Run exams seriously.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[1rem] leading-8 text-text-secondary">
            CodeAssess now supports both a LeetCode-style workspace for open practice
            and a focused exam experience with fullscreen enforcement, clipboard
            blocking, navigation between assigned questions, and a shared 90-minute
            timer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-6 py-3.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Open Practice Workspace
            </Link>
            <Link
              href="/exam"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-6 py-3.5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Start Secure Exam
            </Link>
          </div>
        </div>

        <div className="relative rounded-[30px] border border-border-main bg-[linear-gradient(180deg,rgba(20,27,44,0.95),rgba(12,16,27,0.96))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Practice Problems" value={practiceConfig.totalQuestions} />
            <MetricCard
              label="Optional Practice Timer"
              value={`${practiceConfig.questionTimeLimitMinutes} min`}
            />
            <MetricCard label="Random Exam Problems" value={examConfig.totalQuestions} />
            <MetricCard label="Exam Duration" value={`${examConfig.durationMinutes} min`} />
          </div>

          <div className="mt-5 rounded-3xl border border-border-main bg-black/25 p-5">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-gold">
              Active Modes
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-accent-cyan/15 bg-[rgba(15,240,200,0.05)] px-4 py-4">
                <div className="text-[0.74rem] uppercase tracking-[0.14em] text-accent-cyan">
                  Practice
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-text-secondary">
                  Pick any problem, shuffle to a random question, and optionally
                  start a separate 30-minute timer whenever you want a timed rep.
                </div>
              </div>
              <div className="rounded-2xl border border-accent-blue/20 bg-[rgba(77,124,255,0.08)] px-4 py-4">
                <div className="text-[0.74rem] uppercase tracking-[0.14em] text-accent-blue">
                  Exam
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-text-secondary">
                  Work through a randomly assigned set of problems revealed only at
                  launch inside a guarded 90-minute session with persistent recovery.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
