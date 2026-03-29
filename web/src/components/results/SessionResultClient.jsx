"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import ExamResultsScreen from "../exam/ExamResultsScreen.jsx";
import { WorkspaceLoadingScreen } from "../workspace/WorkspaceLoadingStates.jsx";
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
      <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
        <WorkspacePageNavigation
          backHref="/results"
          backLabel="Back to Results"
          links={[
            { href: "/exam", label: "Exam" },
            { href: "/practice", label: "Practice" },
          ]}
        />

        <div className="mx-auto max-w-[1180px] rounded-[28px] border border-border-main bg-bg-secondary p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-accent-red">
            Result Not Found
          </div>
          <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold text-text-primary">
            No saved result exists for this `sessionId`
          </h1>
          <p className="mt-4 text-[0.92rem] leading-7 text-text-secondary">
            Results are device-local until a backend is connected, so this session was
            either never completed here or has been cleared.
          </p>
          <button
            type="button"
            onClick={() => router.push("/results")}
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            Back to Results
          </button>
        </div>
      </div>
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
