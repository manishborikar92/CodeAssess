"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import ExamResultsScreen from "../exam/ExamResultsScreen.jsx";
import { WorkspaceLoadingScreen } from "../workspace/WorkspaceLoadingStates.jsx";
import { PageContainer, ContentWrapper, HeroCard } from "@/components/ui/Layout";
import { SectionEyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { examSessionRepository } from "../../lib/repositories/examSessionRepository.js";
import { getSessionQuestions } from "../../lib/session/resultsSession.js";
import { questionRepository } from "../../lib/repositories/questionRepository.js";

export default function SessionResultClient({ sessionId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const record = await examSessionRepository.getById(sessionId);

      if (cancelled) {
        return;
      }

      if (!record) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      if (record.lifecycle.status === "active") {
        router.replace(`/exam/${sessionId}`);
        return;
      }

      setSession(record);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  if (isLoading) {
    return <WorkspaceLoadingScreen label="Loading exam result..." />;
  }

  if (!session) {
    return (
      <PageContainer>
        <ContentWrapper>
          <WorkspacePageNavigation
            backHref="/results"
            backLabel="Back to Results"
            links={[
              { href: "/exam", label: "Exam" },
              { href: "/practice", label: "Practice" },
            ]}
          />

          <HeroCard variant="red">
            <SectionEyebrow>Result Not Found</SectionEyebrow>
            <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold text-text-primary">
              No saved result exists for this sessionId
            </h1>
            <p className="mt-4 text-[0.92rem] leading-7 text-text-secondary">
              Results are device-local until a backend is connected, so this session was
              either never completed here or has been cleared.
            </p>
            <Button variant="primary" onClick={() => router.push("/results")} className="mt-6">
              Back to Results
            </Button>
          </HeroCard>
        </ContentWrapper>
      </PageContainer>
    );
  }

  const questions = getSessionQuestions(session, (questionId) =>
    questionRepository.getQuestionById(questionId)
  );

  return (
    <ExamResultsScreen
      onReset={() => router.push("/exam")}
      onResetLabel="Start New Exam"
      questions={questions}
      session={session}
      totalDurationSeconds={session.assessment.durationSeconds}
    />
  );
}
