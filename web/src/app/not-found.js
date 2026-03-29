import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, AsideTitle } from "@/components/ui/Section";
import { InfoPanel, NestedInfoBox } from "@/components/ui/Panel";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <TwoColumnLayout variant="wide" className="mx-auto max-w-[1180px]">
        <HeroCard variant="gold">
          <SectionEyebrow>404 Error</SectionEyebrow>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary">
            This page could not be found
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary">
            The route you requested does not exist or may have been moved. Use the
            navigation options to return to a valid page or explore the available
            sections of CodeAssess.
          </p>

          <InfoPanel variant="blue" className="mt-8">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
              Common Routes
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NestedInfoBox title="Practice">
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Browse the question catalog and solve problems in the persistent
                  practice workspace.
                </div>
              </NestedInfoBox>
              <NestedInfoBox title="Exam">
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Start a secure timed exam session with randomly assigned questions.
                </div>
              </NestedInfoBox>
              <NestedInfoBox title="Join">
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Validate an invitation token and create a new exam session.
                </div>
              </NestedInfoBox>
              <NestedInfoBox title="Results">
                <div className="mt-2 text-[0.88rem] leading-6 text-text-secondary">
                  Review completed exam sessions and view detailed result breakdowns.
                </div>
              </NestedInfoBox>
            </div>
          </InfoPanel>
        </HeroCard>

        <SidePanel>
          <AsideTitle eyebrow="Navigation">
            Return to a valid route
          </AsideTitle>

          <InfoPanel header="Quick Links" variant="card" className="mt-6">
            <p className="mt-3 text-[0.88rem] leading-6 text-text-secondary">
              Use the buttons below to navigate back to the main sections of the
              application.
            </p>
          </InfoPanel>

          <div className="mt-6 flex flex-col gap-3">
            <LinkButton href="/" variant="primary">
              Return Home
            </LinkButton>
            <LinkButton href="/practice" variant="secondary">
              Open Practice
            </LinkButton>
            <LinkButton href="/exam" variant="secondary">
              Start Exam
            </LinkButton>
            <LinkButton href="/results" variant="secondary">
              View Results
            </LinkButton>
          </div>
        </SidePanel>
      </TwoColumnLayout>
    </div>
  );
}
