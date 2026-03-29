"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { StepCard } from "@/components/ui/Card";
import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, SectionTitle, SectionDescription, AsideTitle } from "@/components/ui/Section";
import { SAMPLE_INVITATION_TOKEN } from "../../lib/repositories/examAccessRepository.js";

import { Button } from "@/components/ui/Button";

export default function JoinTokenForm() {
  const router = useRouter();
  const [token, setToken] = useState("");

  const normalizedToken = useMemo(() => token.trim(), [token]);

  return (
    <PageContainer>
      <ContentWrapper>
        <WorkspacePageNavigation
          backHref="/exam"
          backLabel="Back to Exam"
          links={[
            { href: "/results", label: "Results" },
            { href: "/practice", label: "Practice" },
          ]}
        />

        <TwoColumnLayout>
          <HeroCard>
            <SectionEyebrow>Join Exam</SectionEyebrow>
            <SectionTitle>
              Validate an invitation token and create a real exam session
            </SectionTitle>
            <SectionDescription>
              Join routes provision access only. Once the token is verified, the app
              creates a fresh `sessionId`, stores the active exam record, and routes you
              into `/exam/[sessionId]` to begin the timed attempt.
            </SectionDescription>

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
                <Button
                  type="submit"
                  disabled={!normalizedToken}
                  variant="primary"
                >
                  Validate and Join
                </Button>
                <button
                  type="button"
                  onClick={() => setToken(SAMPLE_INVITATION_TOKEN)}
                  className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
                >
                  Use Demo Token
                </button>
              </div>
            </form>
          </HeroCard>

          <SidePanel>
            <AsideTitle eyebrow="Join Flow">
              How invitation-based exam access works
            </AsideTitle>

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
          </SidePanel>
        </TwoColumnLayout>
      </ContentWrapper>
    </PageContainer>
  );
}
