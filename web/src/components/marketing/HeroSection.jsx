import { MetricCard } from "@/components/ui/Card";
import { InfoPanel } from "@/components/ui/Panel";
import { LinkButton } from "@/components/ui/Button";

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
            blocking, navigation between assigned questions, and a shared countdown
            tied directly to each persisted exam session.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/practice" variant="primary" className="px-6 py-3.5">
              Open Practice Workspace
            </LinkButton>
            <LinkButton href="/exam" variant="secondary" className="px-6 py-3.5">
              Start Secure Exam
            </LinkButton>
            <LinkButton href="/help" variant="secondary" className="px-6 py-3.5">
              Read Help
            </LinkButton>
          </div>
        </div>

        <div className="relative rounded-[28px] border border-border-main bg-[linear-gradient(180deg,rgba(20,27,44,0.95),rgba(12,16,27,0.96))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Practice Problems" value={practiceConfig.totalQuestions} />
            <MetricCard
              label="Practice Score Pool"
              value={practiceConfig.totalScore}
            />
            <MetricCard label="Random Exam Problems" value={examConfig.totalQuestions} />
            <MetricCard label="Exam Duration" value={`${examConfig.durationMinutes} min`} />
          </div>

          <InfoPanel variant="default" className="mt-5">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-gold">
              Active Modes
            </div>
            <div className="mt-4 grid gap-3">
              <InfoPanel variant="cyan" className="px-4 py-4">
                <div className="text-[0.74rem] uppercase tracking-[0.14em] text-accent-cyan">
                  Practice
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-text-secondary">
                  Pick any problem, move between question routes instantly, and keep
                  drafts plus best submissions inside one persistent workspace.
                </div>
              </InfoPanel>
              <InfoPanel variant="blue" className="px-4 py-4">
                <div className="text-[0.74rem] uppercase tracking-[0.14em] text-accent-blue">
                  Exam
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-text-secondary">
                  Work through a randomly assigned set of problems revealed only at
                  launch inside a guarded 90-minute session with persistent recovery.
                </div>
              </InfoPanel>
            </div>
          </InfoPanel>
        </div>
      </div>
    </section>
  );
}
