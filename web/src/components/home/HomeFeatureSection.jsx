function FeatureCard({ eyebrow, summary, title }) {
  return (
    <article className="rounded-[24px] border border-border-main bg-bg-secondary p-5">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
        {eyebrow}
      </div>
      <h3 className="mt-3 text-[1.15rem] font-bold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">{summary}</p>
    </article>
  );
}

export default function HomeFeatureSection() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent-cyan">
            Workspace Principles
          </div>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-text-primary">
            Shared primitives that keep the product maintainable
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            eyebrow="Reusable UI"
            title="One workspace header and layout system"
            summary="The coding surfaces now share the same logo, problem navigation, sidebar trigger, and panel layout primitives."
          />
          <FeatureCard
            eyebrow="Assessment Model"
            title="Separate session strategies for practice and exam"
            summary="Practice keeps per-question timing, while exam mode uses a persisted session with a total-duration clock and integrity state."
          />
          <FeatureCard
            eyebrow="Candidate Flow"
            title="Question switching stays intentional"
            summary="Candidates can move between problems from either the sidebar or arrow navigation without losing their saved drafts."
          />
          <FeatureCard
            eyebrow="Current Judge"
            title="Fast local execution with Pyodide"
            summary="The frontend still uses the in-browser Python judge today, while the app structure remains aligned with the future remote judge plan."
          />
        </div>
      </div>
    </section>
  );
}
