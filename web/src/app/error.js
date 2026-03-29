"use client";

import { useEffect } from "react";

import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, AsideTitle } from "@/components/ui/Section";
import { InfoPanel } from "@/components/ui/Panel";
import { Button, LinkButton } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <TwoColumnLayout variant="wide" className="mx-auto max-w-[1180px]">
        <HeroCard variant="red">
          <SectionEyebrow>Application Error</SectionEyebrow>
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
            <Button variant="primary" onClick={reset}>
              Try Again
            </Button>
            <LinkButton href="/" variant="secondary">
              Return Home
            </LinkButton>
          </div>
        </HeroCard>

        <SidePanel>
          <AsideTitle eyebrow="Recovery Options">
            What you can do next
          </AsideTitle>

          <InfoPanel header="Retry" variant="blue" className="mt-6">
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              Click the "Try Again" button to reload the page and attempt to recover
              from the error.
            </p>
          </InfoPanel>

          <InfoPanel header="Navigate Away" variant="gold" className="mt-6">
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              If the error persists, navigate to a different section using the links
              below.
            </p>
          </InfoPanel>

          <div className="mt-6 flex flex-col gap-3">
            <LinkButton href="/practice" variant="secondary">
              Open Practice
            </LinkButton>
            <LinkButton href="/exam" variant="secondary">
              Start Exam
            </LinkButton>
            <LinkButton href="/help" variant="secondary">
              View Help
            </LinkButton>
          </div>
        </SidePanel>
      </TwoColumnLayout>
    </div>
  );
}
