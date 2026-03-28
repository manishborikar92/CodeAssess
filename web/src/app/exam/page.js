import { ExamProvider } from "@/context/ExamContext";
import ExamModeShell from "@/components/exam/ExamModeShell";

export default function ExamPage() {
  return (
    <ExamProvider>
      <ExamModeShell />
    </ExamProvider>
  );
}
