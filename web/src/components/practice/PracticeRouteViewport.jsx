"use client";

import { useMemo } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { usePracticeStore } from "@/providers/PracticeStoreProvider.jsx";

import PracticeWorkspaceClient from "./PracticeWorkspaceClient.jsx";
import { getPracticeRouteState } from "../../lib/routing/practiceRouting.js";

export default function PracticeRouteViewport({ children }) {
  const segment = useSelectedLayoutSegment();
  const questionsById = usePracticeStore((state) => state.questionsById);

  const routeState = useMemo(
    () => getPracticeRouteState(segment, (questionId) => questionsById.has(questionId)),
    [questionsById, segment]
  );

  if (routeState.view === "question") {
    return <PracticeWorkspaceClient questionId={routeState.questionId} />;
  }

  return children;
}
