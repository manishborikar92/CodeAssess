"use client";

import Image from "next/image";
import { StatCard } from "@/components/ui/Card";
import { InfoPanel, NestedInfoBox } from "@/components/ui/Panel";
import { TwoColumnLayout, HeroCard, SidePanel } from "@/components/ui/Layout";
import { SectionEyebrow, SectionTitle, SectionDescription, AsideTitle } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ExamStartScreen({
  config,
  isStarting = false,
  onAcceptRulesChange,
  onStart,
  rulesAccepted,
}) {
  const randomQuestionCount =
    config.questionSelection?.count ?? config.totalQuestions;

  return (
    <TwoColumnLayout>
      <HeroCard>
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border-subtle bg-black/25 px-4 py-2">
          <Image
            src="/logo.svg"
            alt="CodeAssess"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="text-sm font-bold tracking-[0.16em] text-text-primary">
            CodeAssess
          </span>
          <Badge variant="small" tone="gold">
            Exam Mode
          </Badge>
        </div>

        <SectionEyebrow>Secure Coding Assessment</SectionEyebrow>
        <SectionTitle className="max-w-[12ch]">{config.title}</SectionTitle>
        <SectionDescription>
          {config.subtitle}. The exam runs in a focused browser session with a single
          shared timer. Candidates may switch between the selected questions at any
          time, and all drafts are preserved automatically within the session.
        </SectionDescription>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <StatCard label="Duration" value={`${config.durationMinutes} min`} />
          <StatCard label="Random Problems" value={randomQuestionCount} />
          <StatCard
            label="Warnings Before Auto-End"
            value={config.integrityPolicy.maxViolations}
          />
        </div>

        <InfoPanel header="Question Assignment" className="mt-8">
          <NestedInfoBox title="Hidden Until Start">
            <div className="mt-2 text-base font-semibold text-text-primary">
              {randomQuestionCount} questions will be assigned at launch
            </div>
            <p className="mt-2 text-[0.84rem] leading-6 text-text-secondary">
              Problem titles, topics, and ordering stay hidden until the exam
              begins. Once the secure session starts, the assigned questions are
              revealed and remain fixed for the full attempt.
            </p>
          </NestedInfoBox>
        </InfoPanel>
      </HeroCard>

      <SidePanel>
        <AsideTitle eyebrow="Before You Start">
          Confirm the exam rules
        </AsideTitle>

        <InfoPanel header="Integrity Rules" variant="card" className="mt-6">
          <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
            <li>Stay on this page for the full exam. Tab switches are logged as warnings.</li>
            <li>Fullscreen is required while the exam is active. Exit events trigger warnings.</li>
            <li>Copy, cut, paste, and context-menu actions are blocked during the session.</li>
          </ul>
        </InfoPanel>

        <InfoPanel header="Candidate Checklist" variant="card" className="mt-6">
          <ul className="mt-3 space-y-2 text-[0.88rem] leading-6 text-text-secondary">
            <li>Close unrelated tabs and apps before starting.</li>
            <li>Keep a single display connected for the duration of the exam.</li>
            <li>Use the problem list or arrow buttons to move between questions.</li>
            <li>Your random question set is revealed only after the timer starts.</li>
          </ul>
        </InfoPanel>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-border-main bg-bg-card px-4 py-4">
          <input
            type="checkbox"
            checked={rulesAccepted}
            onChange={(event) => onAcceptRulesChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border-main bg-transparent accent-accent-blue"
          />
          <span className="text-[0.84rem] leading-6 text-text-secondary">
            I understand that leaving fullscreen, switching tabs, or attempting to
            copy and paste will be recorded as integrity warnings and may end the
            exam automatically.
          </span>
        </label>

        <Button
          variant="primary"
          onClick={onStart}
          disabled={!rulesAccepted || isStarting}
          className="mt-6 w-full"
        >
          {isStarting ? "Launching Secure Exam..." : "Enter Fullscreen and Start"}
        </Button>
      </SidePanel>
    </TwoColumnLayout>
  );
}
