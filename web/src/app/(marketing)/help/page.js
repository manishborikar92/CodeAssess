import { HelpCard } from "@/components/ui/Card";
import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, SectionTitle, SectionDescription, AsideTitle } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "Help",
  description:
    "Learn how CodeAssess practice, exam, join, and results routes work together.",
};

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
    <PageContainer className="pb-16 pt-28">
      <ContentWrapper maxWidth="1200px">
        <TwoColumnLayout variant="wide">
          <HeroCard variant="cyan">
            <SectionEyebrow>Help Center</SectionEyebrow>
            <SectionTitle>
              Everything you need to move through practice, exam, join, and results
            </SectionTitle>
            <SectionDescription className="max-w-3xl text-[0.98rem] leading-8">
              CodeAssess is fully route-driven. Practice owns open problem solving, exam
              owns the active session, join provisions new exam attempts from invitation
              tokens, and results reads completed session snapshots keyed by `sessionId`.
            </SectionDescription>

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
          </HeroCard>

          <SidePanel>
            <AsideTitle eyebrow="Quick Links">
              Jump straight into the flow you need
            </AsideTitle>

            <div className="mt-6 flex flex-col gap-3">
              <LinkButton href="/practice" variant="secondary">
                Open Practice
              </LinkButton>
              <LinkButton href="/exam" variant="primary">
                Start Exam
              </LinkButton>
              <LinkButton href="/join" variant="secondary">
                Join With Token
              </LinkButton>
              <LinkButton href="/results" variant="secondary">
                View Results
              </LinkButton>
            </div>
          </SidePanel>
        </TwoColumnLayout>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
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
      </ContentWrapper>
    </PageContainer>
  );
}
