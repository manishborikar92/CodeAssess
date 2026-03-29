"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(255,77,106,0.18),transparent_38%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-red">
            Application Error
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            An unexpected error occurred while rendering this page. The error has been
            logged for debugging. You can try reloading the page or return to a
            different section of the application.
          </p>

          <div className="mt-8 rounded-2xl border border-accent-red/20 bg-[rgba(255,77,106,0.08)] p-5">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent-red">
              Error Details
            </div>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Message
              </div>
              <div className="mt-2 font-mono text-[0.84rem] leading-6 text-text-primary">
                {error?.message || "An unknown error occurred"}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Return Home
            </Link>
          </div>
        </section>

        <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Recovery Options
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            What you can do next
          </h2>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
              Retry
            </div>
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              Click the "Try Again" button to reload the page and attempt to recover
              from the error.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-border-main bg-bg-card p-4">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-gold">
              Navigate Away
            </div>
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              If the error persists, navigate to a different section using the links
              below.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
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
              href="/help"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              View Help
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
