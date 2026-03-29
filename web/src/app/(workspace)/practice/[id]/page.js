import { notFound } from "next/navigation";

import { questionRepository } from "@/lib/repositories/questionRepository.js";

export const dynamicParams = false;

export function generateStaticParams() {
  return questionRepository.listQuestions().map((question) => ({
    id: String(question.id),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const question = questionRepository.getQuestionById(id);

  if (!question) {
    return {
      title: "Practice Workspace",
    };
  }

  return {
    title: `Practice: ${question.title}`,
    description: question.scenario,
  };
}

export default async function PracticeQuestionPage({ params }) {
  const { id } = await params;
  const question = questionRepository.getQuestionById(id);

  if (!question) {
    notFound();
  }

  return null;
}
