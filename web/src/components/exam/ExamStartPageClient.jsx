"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { showToast } from "@/components/ui/Toast";
import { AlertBanner } from "@/components/ui/Banner";
import { PageContainer, ContentWrapper } from "@/components/ui/Layout";
import { LinkButton } from "@/components/ui/Button";
import ExamStartScreen from "./ExamStartScreen.jsx";
import { useExamStore, useExamStoreApi } from "../../providers/ExamStoreProvider.jsx";

async function requestAppFullscreen() {
  if (typeof document === "undefined") {
    return false;
  }

  const rootElement = document.documentElement;
  if (!rootElement.requestFullscreen) {
    return false;
  }

  await rootElement.requestFullscreen();
  return Boolean(document.fullscreenElement);
}

export default function ExamStartPageClient() {
  const router = useRouter();
  const examStoreApi = useExamStoreApi();
  const blueprint = useExamStore((state) => state.blueprint);
  const latestActiveSession = useExamStore((state) => state.latestActiveSession);
  const [isStarting, setIsStarting] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const handleStart = useCallback(async () => {
    setIsStarting(true);

    try {
      if (blueprint.integrityPolicy.requireFullscreen) {
        const enteredFullscreen = await requestAppFullscreen();

        if (!enteredFullscreen) {
          showToast(
            "Fullscreen permission is required before the exam can begin.",
            "error",
            4500
          );
          return;
        }
      }

      const session = await examStoreApi.getState().startDirectSession();
      router.push(`/exam/${session.id}`);
    } catch {
      showToast(
        "The browser blocked exam launch. Please try starting the session again.",
        "error",
        4500
      );
    } finally {
      setIsStarting(false);
    }
  }, [blueprint.integrityPolicy.requireFullscreen, examStoreApi, router]);

  return (
    <PageContainer>
      <ContentWrapper>
        <WorkspacePageNavigation
          backHref="/practice"
          backLabel="Back to Practice"
          links={[
            { href: "/join", label: "Join With Token", tone: "primary" },
            { href: "/results", label: "Results" },
          ]}
        />

        {latestActiveSession && (
          <AlertBanner
            variant="info"
            title="Active Session Found"
            description="Resume your most recent unfinished exam session or start a brand new attempt from the lobby."
            action={
              <LinkButton href={`/exam/${latestActiveSession.id}`} variant="primary">
                Resume Session
              </LinkButton>
            }
          />
        )}

        <ExamStartScreen
          config={{
            ...blueprint,
            durationMinutes: Math.round(blueprint.durationSeconds / 60),
            totalQuestions: blueprint.questionSelection.count,
            questionSelection: {
              count: blueprint.questionSelection.count,
            },
            integrityPolicy: blueprint.integrityPolicy,
          }}
          isStarting={isStarting}
          onAcceptRulesChange={setRulesAccepted}
          onStart={handleStart}
          rulesAccepted={rulesAccepted}
        />
      </ContentWrapper>
    </PageContainer>
  );
}
