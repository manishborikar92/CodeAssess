import { ModeCard } from "@/components/ui/ModeCard";

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
            summary="Practice mode behaves like a flexible coding workspace. Candidates can open any question, switch freely, and keep drafts plus best submissions inside one persistent session."
            bullets={[
              "Question list and random problem button for free exploration.",
              "Question routes update instantly while the workspace shell stays mounted.",
              "Dedicated progress view for solved questions, attempts, accuracy, and saved drafts.",
            ]}
            tone="practice"
          />

          <ModeCard
            ctaHref="/exam"
            ctaLabel="Open Exam Mode"
            eyebrow="Secure Exam"
            title="A serious browser-based exam flow for realistic screenings"
            summary="Exam mode launches as a dedicated session with a shared 90-minute timer, random question assignment at start, and enforced integrity guards."
            bullets={[
              "Random questions stay hidden until the secure session begins.",
              "Fullscreen requirement, unload prompts, and visibility tracking.",
              "Clipboard and context-menu blocking across the whole session.",
              "Question switching stays available after launch so candidates can manage time strategically.",
            ]}
            tone="exam"
          />
        </div>
      </div>
    </section>
  );
}
