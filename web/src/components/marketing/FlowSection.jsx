import { StepCard } from "@/components/ui/Card";

function FlowStep({ index, summary, title }) {
  return (
    <div className="relative rounded-2xl border border-border-main bg-bg-secondary p-5">
      <div className="font-mono text-[0.82rem] font-bold text-accent-gold">
        0{index}
      </div>
      <h3 className="mt-3 text-[1.08rem] font-bold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.88rem] leading-7 text-text-secondary">{summary}</p>
    </div>
  );
}

export default function FlowSection() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-[1200px] rounded-[28px] border border-border-main bg-[linear-gradient(180deg,rgba(19,26,42,0.95),rgba(12,16,27,0.96))] p-8">
        <div className="max-w-2xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent-blue">
            Candidate Journey
          </div>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-text-primary">
            A clean path from warm-up practice to a secure exam session
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <FlowStep
            index={1}
            title="Choose the right mode"
            summary="Candidates can rehearse in practice mode or enter a guarded exam session directly from the landing page."
          />
          <FlowStep
            index={2}
            title="Work through problems with clear controls"
            summary="The workspace header keeps the problem list, navigation, and score summary within easy reach, while exam sessions add the shared timer and integrity warnings."
          />
          <FlowStep
            index={3}
            title="Finish with persisted outcomes"
            summary="Practice progress and exam session state both survive refreshes, making recovery and review much more reliable."
          />
        </div>
      </div>
    </section>
  );
}
