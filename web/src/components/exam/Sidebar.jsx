"use client";

import { useExam } from "@/context/ExamContext";

export default function Sidebar() {
  const {
    questions,
    currentQuestionIndex,
    setQuestion,
    getSubmissionStatus,
  } = useExam();

  // Group questions by section
  let lastSection = null;

  return (
    <aside className="bg-bg-secondary border-r border-border-main flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-border-subtle shrink-0">
        <h3 className="text-[0.7rem] uppercase tracking-[2px] text-text-muted font-semibold">
          Questions
        </h3>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto py-1">
        {questions.map((q, idx) => {
          const showSectionLabel = q.section !== lastSection;
          lastSection = q.section;

          const sub = getSubmissionStatus(q.id);
          const dotClass = sub
            ? sub.score >= q.maxScore
              ? "bg-accent-green border-accent-green"
              : sub.score > 0
              ? "bg-accent-gold border-accent-gold"
              : ""
            : "";

          const isActive = idx === currentQuestionIndex;
          const diffClass =
            q.difficulty.toLowerCase().split("-")[0];

          return (
            <div key={q.id}>
              {showSectionLabel && (
                <div className="text-[0.66rem] uppercase tracking-[1.5px] text-accent-blue px-4 pt-2.5 pb-1 font-semibold">
                  Section {q.section}
                </div>
              )}
              <div
                className={`
                  grid grid-cols-[28px_1fr_auto] items-center gap-2
                  px-4 py-2 cursor-pointer transition-colors duration-200
                  border-l-2
                  ${
                    isActive
                      ? "bg-bg-active border-l-accent-blue"
                      : "border-l-transparent hover:bg-bg-hover"
                  }
                `}
                onClick={() => setQuestion(idx)}
              >
                <span
                  className={`font-mono text-[0.72rem] font-semibold text-right ${
                    isActive ? "text-accent-blue" : "text-text-muted"
                  }`}
                >
                  {q.id}
                </span>
                <span
                  className={`text-[0.78rem] leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {q.title}
                </span>
                <div className="flex items-center gap-1.5">
                  {/* Difficulty badge */}
                  <span
                    className={`text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-[0.5px] hidden lg:inline-block ${
                      diffClass === "easy"
                        ? "text-diff-easy bg-[rgba(46,204,143,0.12)]"
                        : diffClass === "medium"
                        ? "text-diff-medium bg-[rgba(240,192,64,0.12)]"
                        : "text-diff-hard bg-[rgba(255,77,106,0.12)]"
                    }`}
                  >
                    {diffClass === "easy" ? "E" : diffClass === "medium" ? "M" : "H"}
                  </span>
                  {/* Status dot */}
                  <span
                    className={`w-[7px] h-[7px] rounded-full border shrink-0 ${
                      dotClass || "bg-transparent border-border-bright"
                    }`}
                    title={
                      sub
                        ? `${sub.score}/${q.maxScore}`
                        : "Not attempted"
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
