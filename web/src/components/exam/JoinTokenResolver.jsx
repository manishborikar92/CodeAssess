"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import WorkspacePageNavigation from "@/components/ui/WorkspacePageNavigation.jsx";
import { WorkspaceLoadingScreen } from "../workspace/WorkspaceLoadingStates.jsx";
import { examAccessRepository } from "../../lib/repositories/examAccessRepository.js";
import { questionRepository } from "../../lib/repositories/questionRepository.js";
import { createExamSessionAttempt } from "../../lib/use-cases/createExamSessionAttempt.js";
import { examSessionRepository } from "../../lib/repositories/examSessionRepository.js";

export default function JoinTokenResolver({ token }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const access = await examAccessRepository.resolveToken(token);
        const { session } = await createExamSessionAttempt({
          blueprint: access.blueprint,
          entry: {
            type: "join",
            joinToken: access.invitation.token,
            invitationId: access.invitation.id,
          },
          questions: questionRepository.listQuestions(),
          sessionRepository: examSessionRepository,
        });

        if (!cancelled) {
          router.replace(`/exam/${session.id}`);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, token]);

  if (!errorMessage) {
    return <WorkspaceLoadingScreen label="Validating invitation token..." />;
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
      <WorkspacePageNavigation
        backHref="/join"
        backLabel="Back to Join"
        links={[
          { href: "/exam", label: "Exam" },
          { href: "/results", label: "Results" },
          { href: "/practice", label: "Practice" },
        ]}
      />

      <div className="mx-auto max-w-[1180px]">
        <section className="rounded-[28px] border border-border-main bg-[radial-gradient(circle_at_top_left,rgba(255,77,106,0.14),transparent_34%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-accent-red">
            Join Failed
          </p>
          <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-text-primary">
            This invitation token could not be used
          </h1>
          <p className="mt-4 max-w-3xl text-[0.95rem] leading-8 text-text-secondary">
            The access repository rejected this token before an exam session was
            provisioned, so no `sessionId` was created and nothing was written into the
            exam session repository.
          </p>

          <div className="mt-8 rounded-2xl border border-accent-red/20 bg-[rgba(255,77,106,0.08)] p-6">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-red">
              Validation Error
            </div>
            <p className="mt-3 text-[0.92rem] leading-7 text-text-secondary">
              {errorMessage}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-[#3060d0] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Try Another Token
            </Link>
            <Link
              href="/exam"
              className="inline-flex items-center justify-center rounded-2xl border border-border-main px-5 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
            >
              Back to Exam Lobby
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
