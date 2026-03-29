"use client";

import { formatQuestionDifficulty } from "@/lib/questions/questionCatalog.mjs";
import { DifficultyBadge, StatusDot } from "@/components/ui/Badge";

export default function QuestionSidebar({
  currentQuestionIndex,
  description,
  questions,
  onSelectQuestion,
  title = "Questions",
}) {
  return (
    <aside className="flex h-full flex-col overflow-hidden border-r border-border-main bg-bg-secondary">
      <div className="shrink-0 border-b border-border-subtle px-4 pt-3.5 pb-2.5">
        <h3 className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-text-muted">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-[0.72rem] text-text-muted">{description}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {questions.map((question, index) => {
          const difficulty = question.difficulty;
          const isActive = index === currentQuestionIndex;

          return (
            <div key={question.id}>
              <button
                type="button"
                onClick={() => onSelectQuestion(index)}
                className={`grid w-full grid-cols-[28px_1fr_auto] items-center gap-2 border-l-2 px-4 py-2 text-left transition-colors duration-200 ${
                  isActive
                    ? "border-l-accent-blue bg-bg-active"
                    : "border-l-transparent hover:bg-bg-hover"
                }`}
              >
                <span
                  className={`text-right font-mono text-[0.72rem] font-semibold ${
                    isActive ? "text-accent-blue" : "text-text-muted"
                  }`}
                >
                  {question.id}
                </span>

                <span
                  className={`overflow-hidden text-ellipsis whitespace-nowrap text-[0.78rem] leading-tight ${
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {question.title}
                </span>

                <div className="flex items-center gap-1.5">
                  <DifficultyBadge 
                    difficulty={difficulty} 
                    className="hidden lg:inline-block"
                  />

                  <StatusDot
                    status={question.status}
                    title={question.statusTitle || "Question status"}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
