"use client";

import { PracticeSessionProvider } from "@/context/PracticeSessionContext";
import PracticeWorkspaceShell from "@/components/exam/PracticeWorkspaceShell";

export default function PracticePage() {
  return (
    <PracticeSessionProvider>
      <PracticeWorkspaceShell />
    </PracticeSessionProvider>
  );
}
