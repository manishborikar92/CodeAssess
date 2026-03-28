"use client";

import { PracticeProvider } from "@/context/PracticeContext";
import PracticeWorkspaceShell from "@/components/exam/PracticeWorkspaceShell";

export default function PracticePage() {
  return (
    <PracticeProvider>
      <PracticeWorkspaceShell />
    </PracticeProvider>
  );
}
