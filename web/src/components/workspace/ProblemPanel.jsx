"use client";

import { formatQuestionDifficulty } from "@/lib/questions/questionCatalog.mjs";
import { DifficultyBadge } from "@/components/ui/Badge";

export default function ProblemPanel({
  question,
  timeSummary,
  controls,
  emptyStateMessage = "Choose a question from the sidebar to start solving.",
}) {
  if (!question) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm px-6 text-center">
        {emptyStateMessage}
      </div>
    );
  }

  const difficulty = question.difficulty;
  const summaryLine = timeSummary ? ` | ${timeSummary}` : "";

  return (
    <section className="border-r border-border-main overflow-y-auto flex flex-col h-full">
      <div className="px-6 pt-[18px] pb-3.5 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[0.66rem] font-semibold tracking-[0.5px] px-2 py-0.5 rounded-xl border text-text-muted border-border-main bg-transparent uppercase">
            {question.topic}
          </span>

          <DifficultyBadge difficulty={difficulty} />
        </div>

        <h2 className="text-[1.15rem] font-bold leading-tight text-text-primary">
          Q{question.id}. {question.title}
        </h2>

        <div className="text-[0.72rem] text-text-muted mt-1.5">
          Max Score: {question.maxScore} pts{summaryLine}
        </div>

        {controls && <div className="mt-3">{controls}</div>}
      </div>

      <div className="px-6 py-5 flex-1">
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mb-1.5">
          Problem Scenario
        </h4>
        <div className="bg-bg-card border border-border-subtle border-l-[3px] border-l-accent-blue rounded-lg p-3.5 text-[0.85rem] text-text-secondary leading-relaxed mb-4">
          {question.scenario}
        </div>

        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Problem Statement
        </h4>
        <p className="text-[0.88rem] text-text-secondary leading-relaxed mb-4">
          {question.statement}
        </p>

        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Constraints
        </h4>
        <ul className="flex flex-col gap-0.5 mb-4">
          {question.constraints.map((constraint, index) => (
            <li
              key={index}
              className="font-mono text-[0.8rem] text-accent-gold py-0.5 before:content-['>_'] before:text-accent-blue before:text-[0.75rem]"
            >
              {constraint}
            </li>
          ))}
        </ul>

        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Input Format
        </h4>
        <div className="bg-bg-tertiary border border-border-subtle rounded-lg p-3 font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap break-all leading-relaxed mb-4">
          {question.inputFormat}
        </div>

        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Output Format
        </h4>
        <div className="bg-bg-tertiary border border-border-subtle rounded-lg p-3 font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap break-all leading-relaxed mb-4">
          {question.outputFormat}
        </div>

        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Sample Test Cases
        </h4>
        {question.sampleCases.map((sampleCase, index) => (
          <div
            key={index}
            className="bg-bg-card border border-border-main rounded-lg overflow-hidden mb-2.5"
          >
            <div className="bg-bg-tertiary px-3 py-1.5 text-[0.68rem] uppercase tracking-[1px] text-text-muted font-semibold">
              Sample {index + 1}
            </div>
            <div className="grid grid-cols-2">
              <div className="p-3 border-r border-border-subtle">
                <label className="text-[0.64rem] uppercase tracking-[1px] text-text-muted block mb-1">
                  Input
                </label>
                <pre className="font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap">
                  {sampleCase.input}
                </pre>
              </div>
              <div className="p-3">
                <label className="text-[0.64rem] uppercase tracking-[1px] text-text-muted block mb-1">
                  Output
                </label>
                <pre className="font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap">
                  {sampleCase.output}
                </pre>
              </div>
            </div>
            {sampleCase.explanation && (
              <div className="px-3 py-2 border-t border-border-subtle text-[0.78rem] text-text-muted leading-normal">
                Hint: {sampleCase.explanation}
              </div>
            )}
          </div>
        ))}

        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Approach / Hint
        </h4>
        <div className="bg-[rgba(77,124,255,0.06)] border border-[rgba(77,124,255,0.2)] rounded-lg p-3.5 text-[0.8rem] text-text-secondary leading-relaxed">
          {question.hint}
        </div>
      </div>
    </section>
  );
}
