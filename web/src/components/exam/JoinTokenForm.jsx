"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { SAMPLE_INVITATION_TOKEN } from "../../lib/repositories/examAccessRepository.js";

function StepCard({ description, label, title }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
        {label}
      </div>
      <div className="mt-3 text-[1rem] font-semibold text-text-primary">{title}</div>
      <p className="mt-2 text-[0.84rem] leading-6 text-text-secondary">{description}</p>
    </div>
  );
}

export default function JoinTokenForm() {
  const router = useRouter();
  const [token, setToken] = useState("");

  const normalizedToken = useMemo(() => token.trim(), [token]);

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <WorkspacePageNavigation
        backHref="/exam"
        backLabel="Back to Exam"
        links={[
          { href: "/results", label: "Results" },
          { href: "/practice", label: "Practice" },
        ]}
      />

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan">
            Join Exam
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            Validate an invitation token and create a real exam session
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            Join routes provision access only. Once the token is verified, the app
            creates a fresh `sessionId`, stores the active exam record, and routes you
            into `/exam/[sessionId]` to begin the timed attempt.
          </p>

          <form
            className="mt-8 rounded-2xl border border-border-main bg-black/20 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!normalizedToken) {
                return;
              }

              router.push(`/join/${normalizedToken}`);
            }}
          >
            <label className="block text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Invitation Token
            </label>
            <textarea
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-3 min-h-[100px] w-full rounded-2xl border border-border-main bg-bg-card p-4 font-mono text-[0.82rem] leading-6 text-text-primary outline-none transition-colors duration-200 focus:border-accent-blue"
              placeholder="Paste the full invitation token here"
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[0.82rem] leading-6 text-text-secondary">
                The token never becomes the session identity. It only grants access to
                a new exam attempt.
              </p>
              <div className="font-mono text-[0.76rem] text-text-muted">
                {normalizedToken ? `${normalizedToken.length} chars` : "Token required"}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!normalizedToken}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Validate and Join
              </button>
              <button
                type="button"
                onClick={() => setToken(SAMPLE_INVITATION_TOKEN)}
                className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
              >
                Use Demo Token
              </button>
            </div>
          </form>
        </section>

        <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Join Flow
          </div>
          <h2 className="mt-3 text-[1.8rem] font-bold text-text-primary">
            How invitation-based exam access works
          </h2>

          <div className="mt-6 grid gap-4">
            <StepCard
              label="Step 1"
              title="Resolve the token"
              description="The exam access repository validates the invitation signature and resolves the linked blueprint."
            />
            <StepCard
              label="Step 2"
              title="Create a session"
              description="A new exam session record is created only after access succeeds, with `sessionId` owned by the session repository."
            />
            <StepCard
              label="Step 3"
              title="Enter the exam route"
              description="The app redirects into `/exam/[sessionId]`, where the route-scoped exam store hydrates the active session."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
