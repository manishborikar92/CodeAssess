import { ExamStoreProvider } from "@/providers/ExamStoreProvider.jsx";
import { questionRepository } from "@/lib/repositories/questionRepository.js";

export default function ExamLayout({ children }) {
  const questions = questionRepository.listQuestions();
  const blueprint = questionRepository.getDefaultExamBlueprint();

  return (
    <ExamStoreProvider blueprint={blueprint} questions={questions}>
      {children}
    </ExamStoreProvider>
  );
}
