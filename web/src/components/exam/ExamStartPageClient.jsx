"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { showToast } from "@/components/ui/Toast";

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
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <WorkspacePageNavigation
        backHref="/practice"
        backLabel="Back to Practice"
        links={[
          { href: "/join", label: "Join With Token", tone: "primary" },
          { href: "/results", label: "Results" },
        ]}
      />

      {latestActiveSession && (
        <div className="mx-auto max-w-[1180px] mb-6">
          <div className="rounded-3xl border border-accent-cyan/20 bg-[rgba(15,240,200,0.06)] px-5 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent-cyan">
                  Active Session Found
                </div>
                <div className="mt-2 text-sm leading-7 text-text-secondary">
                  Resume your most recent unfinished exam session or start a brand new
                  attempt from the lobby.
                </div>
              </div>
              <Link
                href={`/exam/${latestActiveSession.id}`}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              >
                Resume Session
              </Link>
            </div>
          </div>
        </div>
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
    </div>
  );
}
