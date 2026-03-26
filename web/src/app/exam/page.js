"use client";

import { ExamProvider } from "@/context/ExamContext";
import ExamShell from "@/components/exam/ExamShell";

export default function ExamPage() {
  return (
    <ExamProvider>
      <ExamShell />
    </ExamProvider>
  );
}
