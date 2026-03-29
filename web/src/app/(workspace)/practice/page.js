import PracticeQuestionBrowser from "@/components/practice/PracticeQuestionBrowser.jsx";
import { questionRepository } from "@/lib/repositories/questionRepository.js";

export const metadata = {
  title: "Practice Workspace",
  description:
    "Browse the full question catalog and continue saved practice work by opening a question-specific route.",
};

export default function PracticeIndexPage() {
  const questions = questionRepository.listQuestions();

  return <PracticeQuestionBrowser questions={questions} />;
}
