"use client";

import { useExam } from "@/context/ExamContext";

export default function Sidebar({ onSelectQuestion }) {
  const {
    currentQuestionIndex,
    drafts,
    getQuestionTimerStatus,
    getSubmissionStatus,
    questions,
  } = useExam();

  return (
    <aside className="bg-bg-secondary border-r border-border-main flex flex-col overflow-hidden h-full">
      <div className="px-4 pt-3.5 pb-2.5 border-b border-border-subtle shrink-0">
        <h3 className="text-[0.7rem] uppercase tracking-[2px] text-text-muted font-semibold">
          Questions
        </h3>
        <p className="text-[0.72rem] text-text-muted mt-1">
          Pick any question. Selecting one opens it and closes this list.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {questions.map((question, index) => {
          const previousQuestion = questions[index - 1];
          const showSectionLabel =
            index === 0 || previousQuestion.section !== question.section;

          const submission = getSubmissionStatus(question.id);
          const timer = getQuestionTimerStatus(question.id);
          const hasDraft = drafts[question.id] !== undefined;
          const isSolved = Boolean(submission && submission.score >= question.maxScore);
          const isPartial = Boolean(submission && submission.score > 0 && !isSolved);
          const isInProgress = !submission && (timer.hasStarted || hasDraft);

          let dotClass = "bg-transparent border-border-bright";
          if (isSolved) {
            dotClass = "bg-accent-green border-accent-green";
          } else if (isPartial) {
            dotClass = "bg-accent-gold border-accent-gold";
          } else if (timer.isExpired) {
            dotClass = "bg-accent-red border-accent-red";
          } else if (isInProgress) {
            dotClass = "bg-accent-blue border-accent-blue";
          }

          const difficulty = question.difficulty.toLowerCase().split("-")[0];
          const isActive = index === currentQuestionIndex;

          return (
            <div key={question.id}>
              {showSectionLabel && (
                <div className="text-[0.66rem] uppercase tracking-[1.5px] text-accent-blue px-4 pt-2.5 pb-1 font-semibold">
                  Section {question.section}
                </div>
              )}

              <button
                type="button"
                className={`
                  w-full text-left grid grid-cols-[28px_1fr_auto] items-center gap-2
                  px-4 py-2 transition-colors duration-200 border-l-2
                  ${
                    isActive
                      ? "bg-bg-active border-l-accent-blue"
                      : "border-l-transparent hover:bg-bg-hover"
                  }
                `}
                onClick={() => onSelectQuestion(index)}
              >
                <span
                  className={`font-mono text-[0.72rem] font-semibold text-right ${
                    isActive ? "text-accent-blue" : "text-text-muted"
                  }`}
                >
                  {question.id}
                </span>

                <span
                  className={`text-[0.78rem] leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {question.title}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-[0.5px] hidden lg:inline-block ${
                      difficulty === "easy"
                        ? "text-diff-easy bg-[rgba(46,204,143,0.12)]"
                        : difficulty === "medium"
                        ? "text-diff-medium bg-[rgba(240,192,64,0.12)]"
                        : "text-diff-hard bg-[rgba(255,77,106,0.12)]"
                    }`}
                  >
                    {difficulty === "easy" ? "E" : difficulty === "medium" ? "M" : "H"}
                  </span>

                  <span
                    className={`w-[7px] h-[7px] rounded-full border shrink-0 ${dotClass}`}
                    title={
                      isSolved
                        ? `${submission.score}/${question.maxScore}`
                        : timer.isExpired
                        ? "Time limit reached"
                        : isInProgress
                        ? "In progress"
                        : "Not started"
                    }
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
