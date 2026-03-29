import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(255,140,66,0.18),transparent_38%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-gold">
            404 Error
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            This page could not be found
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            The route you requested does not exist or may have been moved. Use the
            navigation options to return to a valid page or explore the available
            sections of CodeAssess.
          </p>

          <div className="mt-8 rounded-2xl border border-border-main bg-black/20 p-5">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
              Common Routes
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Practice
                </div>
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Browse the question catalog and solve problems in the persistent
                  practice workspace.
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Exam
                </div>
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Start a secure timed exam session with randomly assigned questions.
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Join
                </div>
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Validate an invitation token and create a new exam session.
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Results
                </div>
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Review completed exam sessions and view detailed result breakdowns.
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Navigation
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            Return to a valid route
          </h2>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
              Quick Links
            </div>
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              Use the buttons below to navigate back to the main sections of the
              application.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Return Home
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Open Practice
            </Link>
            <Link
              href="/exam"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Start Exam
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
    </div>
  );
}
