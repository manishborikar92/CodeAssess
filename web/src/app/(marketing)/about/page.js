import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Learn the product principles behind CodeAssess and how practice plus exam flows stay aligned.",
};

function PrincipleCard({ description, title }) {
  return (
    <div className="rounded-[24px] border border-border-main bg-bg-secondary p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
      <h3 className="text-[1.08rem] font-semibold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">{description}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 pb-16 pt-28">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px]">
        <section className="rounded-[30px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.16),transparent_34%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-accent-cyan">
            About CodeAssess
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            A route-driven assessment platform built for clear boundaries and real workflows
          </h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-8 text-text-secondary">
            CodeAssess combines open-ended practice with a secure timed exam flow in
            one frontend application. The product is organized around clear route
            ownership, repository-backed persistence, and route-scoped client stores so
            the current browser-only implementation can grow into a production backend
            without architectural rewrites.
          </p>
        </section>

        <aside className="rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Core Routes
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Each route family owns one responsibility
          </h2>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4 text-[0.88rem] leading-6 text-text-secondary">
            <p><strong className="text-text-primary">Practice:</strong> browse and solve public questions.</p>
            <p className="mt-2"><strong className="text-text-primary">Exam:</strong> run the active secure session.</p>
            <p className="mt-2"><strong className="text-text-primary">Join:</strong> validate invitation tokens and create sessions.</p>
            <p className="mt-2"><strong className="text-text-primary">Results:</strong> review completed immutable session snapshots.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Read Help
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Open Product
            </Link>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1200px] gap-4 lg:grid-cols-3">
        <PrincipleCard
          title="Route ownership first"
          description="The URL decides the current workflow. Practice, exam, join, and results stay separate so navigation, state ownership, and persistence contracts remain easy to reason about."
        />
        <PrincipleCard
          title="Repository-backed persistence"
          description="Client stores never write directly to browser storage. Repositories own persistence and serialization so today’s IndexedDB implementation can be replaced by future API-backed adapters."
        />
        <PrincipleCard
          title="Scoped interactive state"
          description="Zustand stores are created at the route layout boundary. Exam and practice keep independent client state trees, which avoids global singleton state and keeps updates focused."
        />
      </div>
    </div>
  );
}
