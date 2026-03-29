import Link from "next/link";

export const metadata = {
  title: "Help",
  description:
    "Learn how CodeAssess practice, exam, join, and results routes work together.",
};

function HelpCard({ description, title }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-secondary p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
      <h3 className="text-[1.08rem] font-semibold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">{description}</p>
    </div>
  );
}

function FaqItem({ answer, question }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-secondary p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
        FAQ
      </div>
      <h3 className="mt-3 text-[1.08rem] font-semibold text-text-primary">{question}</h3>
      <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">{answer}</p>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 pb-16 pt-28">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px]">
        <section className="rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.16),transparent_34%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-accent-cyan">
            Help Center
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            Everything you need to move through practice, exam, join, and results
          </h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-8 text-text-secondary">
            CodeAssess is fully route-driven. Practice owns open problem solving, exam
            owns the active session, join provisions new exam attempts from invitation
            tokens, and results reads completed session snapshots keyed by `sessionId`.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <HelpCard
              title="Practice"
              description="Use `/practice` to browse the public question catalog and `/practice/[id]` to solve a specific problem inside the same mounted workspace."
            />
            <HelpCard
              title="Exam"
              description="Use `/exam` to start a secure assessment and `/exam/[sessionId]` to work inside the active timed session."
            />
            <HelpCard
              title="Join"
              description="Use `/join` or `/join/[token]` when an invitation token should provision a fresh exam session before redirecting into `/exam/[sessionId]`."
            />
            <HelpCard
              title="Results"
              description="Use `/results` to review completed sessions and `/results/[sessionId]` to open a specific immutable result snapshot."
            />
          </div>
        </section>

        <aside className="rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Quick Links
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Jump straight into the flow you need
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Open Practice
            </Link>
            <Link
              href="/exam"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Start Exam
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Join With Token
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              View Results
            </Link>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1200px] gap-4 lg:grid-cols-2">
        <FaqItem
          question="Where is my session data stored today?"
          answer="Exam sessions and practice workspaces are stored in the browser repository on the current device. That keeps the route contracts stable today while staying ready for a future server-backed repository."
        />
        <FaqItem
          question="Does the exam timer survive refresh?"
          answer="Yes. The active exam timer is derived from the session lifecycle timestamps in the exam session record, so a refresh or re-entry into `/exam/[sessionId]` resumes from the persisted start time."
        />
        <FaqItem
          question="Can I switch practice questions without losing the workspace?"
          answer="Yes. `/practice/[id]` stays in the URL, but question switching is client-controlled so only the question content updates while the practice workspace shell remains mounted."
        />
        <FaqItem
          question="Why are join and results outside the exam route?"
          answer="They have different responsibilities. Join provisions access and creates sessions, while results reads completed immutable snapshots. Keeping them separate prevents the exam module from mixing unrelated route concerns."
        />
      </div>
    </div>
  );
}
