"use client";

import { useMemo } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { usePracticeStore } from "@/providers/PracticeStoreProvider.jsx";

import PracticeWorkspaceShell from "./PracticeWorkspaceShell.jsx";
import { getPracticeRouteState } from "./practiceRouteState.js";

export default function PracticeRouteViewport({ children }) {
  const segment = useSelectedLayoutSegment();
  const questionsById = usePracticeStore((state) => state.questionsById);

  const routeState = useMemo(
    () => getPracticeRouteState(segment, (questionId) => questionsById.has(questionId)),
    [questionsById, segment]
  );

  if (routeState.view === "question") {
    return <PracticeWorkspaceShell questionId={routeState.questionId} />;
  }

  return children;
}
