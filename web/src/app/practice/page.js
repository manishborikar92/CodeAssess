"use client";

import { ExamProvider } from "@/context/ExamContext";
import ExamShell from "@/components/exam/ExamShell";

export default function PracticePage() {
  return (
    <ExamProvider>
      <ExamShell />
    </ExamProvider>
  );
}
