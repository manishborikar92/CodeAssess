import { PracticeStoreProvider } from "@/providers/PracticeStoreProvider.jsx";
import { questionRepository } from "@/lib/repositories/questionRepository.js";
import PracticeRouteViewport from "@/components/practice/PracticeRouteViewport.jsx";

export default function PracticeLayout({ children }) {
  const questions = questionRepository.listQuestions();

  return (
    <PracticeStoreProvider questions={questions}>
      <PracticeRouteViewport>{children}</PracticeRouteViewport>
    </PracticeStoreProvider>
  );
}
