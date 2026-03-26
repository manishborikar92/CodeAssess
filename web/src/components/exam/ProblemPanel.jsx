"use client";

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function ProblemPanel({ question }) {
  if (!question) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        Select a question to begin
      </div>
    );
  }

  const q = question;
  const diffClass = q.difficulty.toLowerCase().split("-")[0];

  return (
    <section className="border-r border-border-main overflow-y-auto flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-[18px] pb-3.5 border-b border-border-subtle shrink-0">
        {/* Meta tags */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-[0.66rem] font-semibold tracking-[0.5px] px-2 py-0.5 rounded-xl border uppercase ${
              q.section === "A"
                ? "text-accent-blue border-accent-blue bg-[rgba(77,124,255,0.08)]"
                : "text-accent-cyan border-accent-cyan bg-[rgba(15,240,200,0.08)]"
            }`}
          >
            Section {q.section}
          </span>
          <span className="text-[0.66rem] font-semibold tracking-[0.5px] px-2 py-0.5 rounded-xl border text-text-muted border-border-main bg-transparent uppercase">
            {q.topic}
          </span>
          <span
            className={`text-[0.66rem] font-bold px-2 py-0.5 rounded-xl uppercase tracking-[0.5px] ${
              diffClass === "easy"
                ? "text-diff-easy bg-[rgba(46,204,143,0.12)]"
                : diffClass === "medium"
                ? "text-diff-medium bg-[rgba(240,192,64,0.12)]"
                : "text-diff-hard bg-[rgba(255,77,106,0.12)]"
            }`}
          >
            {q.difficulty}
          </span>
        </div>

        <h2 className="text-[1.15rem] font-bold leading-tight text-text-primary">
          Q{q.id}. {q.title}
        </h2>
        <div className="text-[0.72rem] text-text-muted mt-1.5">
          Max Score: {q.maxScore} pts · Time Limit: Shared
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex-1">
        {/* Scenario */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mb-1.5">
          Problem Scenario
        </h4>
        <div className="bg-bg-card border border-border-subtle border-l-[3px] border-l-accent-blue rounded-lg p-3.5 text-[0.85rem] text-text-secondary leading-relaxed mb-4">
          {q.scenario}
        </div>

        {/* Statement */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Problem Statement
        </h4>
        <p className="text-[0.88rem] text-text-secondary leading-relaxed mb-4">
          {q.statement}
        </p>

        {/* Constraints */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Constraints
        </h4>
        <ul className="flex flex-col gap-0.5 mb-4">
          {q.constraints.map((c, i) => (
            <li
              key={i}
              className="font-mono text-[0.8rem] text-accent-gold py-0.5 before:content-['▸_'] before:text-accent-blue before:text-[0.75rem]"
            >
              {c}
            </li>
          ))}
        </ul>

        {/* Input Format */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Input Format
        </h4>
        <div className="bg-bg-tertiary border border-border-subtle rounded-lg p-3 font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap break-all leading-relaxed mb-4">
          {q.inputFormat}
        </div>

        {/* Output Format */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Output Format
        </h4>
        <div className="bg-bg-tertiary border border-border-subtle rounded-lg p-3 font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap break-all leading-relaxed mb-4">
          {q.outputFormat}
        </div>

        {/* Sample Test Cases */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Sample Test Cases
        </h4>
        {q.sampleCases.map((sc, i) => (
          <div
            key={i}
            className="bg-bg-card border border-border-main rounded-lg overflow-hidden mb-2.5"
          >
            <div className="bg-bg-tertiary px-3 py-1.5 text-[0.68rem] uppercase tracking-[1px] text-text-muted font-semibold">
              Sample {i + 1}
            </div>
            <div className="grid grid-cols-2">
              <div className="p-3 border-r border-border-subtle">
                <label className="text-[0.64rem] uppercase tracking-[1px] text-text-muted block mb-1">
                  Input
                </label>
                <pre className="font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap">
                  {sc.input}
                </pre>
              </div>
              <div className="p-3">
                <label className="text-[0.64rem] uppercase tracking-[1px] text-text-muted block mb-1">
                  Output
                </label>
                <pre className="font-mono text-[0.8rem] text-text-primary whitespace-pre-wrap">
                  {sc.output}
                </pre>
              </div>
            </div>
            {sc.explanation && (
              <div className="px-3 py-2 border-t border-border-subtle text-[0.78rem] text-text-muted leading-normal">
                💡 {sc.explanation}
              </div>
            )}
          </div>
        ))}

        {/* Hint */}
        <h4 className="text-[0.7rem] uppercase tracking-[1.5px] text-accent-blue font-semibold mt-4 mb-1.5">
          Approach / Hint
        </h4>
        <div className="bg-[rgba(77,124,255,0.06)] border border-[rgba(77,124,255,0.2)] rounded-lg p-3.5 text-[0.8rem] text-text-secondary leading-relaxed">
          {q.hint}
        </div>
      </div>
    </section>
  );
}
