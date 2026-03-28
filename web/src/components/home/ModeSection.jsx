import Link from "next/link";

function ModeCard({ ctaHref, ctaLabel, eyebrow, summary, title, bullets, tone }) {
  const accentClass =
    tone === "exam"
      ? "text-accent-blue border-accent-blue/20 bg-[rgba(77,124,255,0.08)]"
      : "text-accent-cyan border-accent-cyan/20 bg-[rgba(15,240,200,0.08)]";

  return (
    <article className="rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${accentClass}`}>
        {eyebrow}
      </div>
      <h3 className="mt-4 text-[1.7rem] font-bold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.94rem] leading-7 text-text-secondary">{summary}</p>

      <div className="mt-5 space-y-3">
        {bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-2xl border border-border-subtle bg-bg-card px-4 py-3 text-[0.86rem] leading-6 text-text-secondary"
          >
            {bullet}
          </div>
        ))}
      </div>

      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-2xl border border-border-main px-4 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}

export default function ModeSection() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent-gold">
            Two Candidate Flows
          </div>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-text-primary">
            One codebase, two distinct assessment experiences
          </h2>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ModeCard
            ctaHref="/practice"
            ctaLabel="Go to Practice"
            eyebrow="Practice Workspace"
            title="Open problem solving, built for deliberate reps"
            summary="Practice mode behaves like a flexible coding workspace. Candidates can open any question, switch freely, and track independent timers per problem."
            bullets={[
              "Question list and random problem button for free exploration.",
              "Per-question 30-minute limits that pause when you switch away.",
              "Progress snapshots, stored drafts, and per-problem score tracking.",
            ]}
            tone="practice"
          />

          <ModeCard
            ctaHref="/exam"
            ctaLabel="Open Exam Mode"
            eyebrow="Secure Exam"
            title="A serious browser-based exam flow for realistic screenings"
            summary="Exam mode launches as a dedicated session with a shared 90-minute timer, focused navigation across assigned questions, and enforced integrity guards."
            bullets={[
              "Fullscreen requirement, unload prompts, and visibility tracking.",
              "Clipboard and context-menu blocking across the whole session.",
              "Question switching stays available so candidates can manage time strategically.",
            ]}
            tone="exam"
          />
        </div>
      </div>
    </section>
  );
}
