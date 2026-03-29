import { PageContainer, ContentWrapper, TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, AsideTitle } from "@/components/ui/Section";
import { InfoCard } from "@/components/ui/Card";
import { InfoPanel } from "@/components/ui/Panel";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "About",
  description:
    "Learn the product principles behind CodeAssess and how practice plus exam flows stay aligned.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 pb-16 pt-28">
      <TwoColumnLayout variant="wide" className="mx-auto max-w-[1200px]">
        <HeroCard variant="blue">
          <SectionEyebrow>About CodeAssess</SectionEyebrow>
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
        </HeroCard>

        <SidePanel>
          <AsideTitle eyebrow="Core Routes">
            Each route family owns one responsibility
          </AsideTitle>

          <InfoPanel variant="card" className="mt-6">
            <div className="text-[0.88rem] leading-6 text-text-secondary">
              <p><strong className="text-text-primary">Practice:</strong> browse and solve public questions.</p>
              <p className="mt-2"><strong className="text-text-primary">Exam:</strong> run the active secure session.</p>
              <p className="mt-2"><strong className="text-text-primary">Join:</strong> validate invitation tokens and create sessions.</p>
              <p className="mt-2"><strong className="text-text-primary">Results:</strong> review completed immutable session snapshots.</p>
            </div>
          </InfoPanel>

          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/help" variant="secondary">
              Read Help
            </LinkButton>
            <LinkButton href="/practice" variant="primary">
              Open Product
            </LinkButton>
          </div>
        </SidePanel>
      </TwoColumnLayout>

      <div className="mx-auto mt-8 grid max-w-[1200px] gap-4 lg:grid-cols-3">
        <InfoCard>
          <h3 className="text-[1.08rem] font-semibold text-text-primary">Route ownership first</h3>
          <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">
            The URL decides the current workflow. Practice, exam, join, and results stay separate so navigation, state ownership, and persistence contracts remain easy to reason about.
          </p>
        </InfoCard>
        <InfoCard>
          <h3 className="text-[1.08rem] font-semibold text-text-primary">Repository-backed persistence</h3>
          <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">
            Client stores never write directly to browser storage. Repositories own persistence and serialization so today's IndexedDB implementation can be replaced by future API-backed adapters.
          </p>
        </InfoCard>
        <InfoCard>
          <h3 className="text-[1.08rem] font-semibold text-text-primary">Scoped interactive state</h3>
          <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">
            Zustand stores are created at the route layout boundary. Exam and practice keep independent client state trees, which avoids global singleton state and keeps updates focused.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
