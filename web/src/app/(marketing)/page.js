import FeatureSection from "@/components/marketing/FeatureSection";
import FlowSection from "@/components/marketing/FlowSection";
import HeroSection from "@/components/marketing/HeroSection";
import ModeSection from "@/components/marketing/ModeSection";
import { buildPracticeConfig } from "@/lib/assessment/assessmentConfig.mjs";
import { questionRepository } from "@/lib/repositories/questionRepository.js";

export const metadata = {
  title: "CodeAssess",
  description:
    "Practice coding problems freely or launch secure browser-based exam sessions with persistent local session recovery.",
};

export default function MarketingHomePage() {
  const questions = questionRepository.listQuestions();
  const practiceConfig = buildPracticeConfig(questions);
  const blueprint = questionRepository.getDefaultExamBlueprint();
  const examConfig = {
    title: blueprint.title,
    subtitle: blueprint.subtitle,
    durationMinutes: Math.round(blueprint.durationSeconds / 60),
    totalQuestions: blueprint.questionSelection.count,
    questionSelection: blueprint.questionSelection,
    integrityPolicy: blueprint.integrityPolicy,
  };

  return (
    <>
      <HeroSection examConfig={examConfig} practiceConfig={practiceConfig} />
      <ModeSection />
      <FeatureSection />
      <FlowSection />
    </>
  );
}
