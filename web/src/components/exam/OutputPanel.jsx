"use client";

import { useState, useRef } from "react";
import Spinner from "@/components/ui/Spinner";

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function OutputPanel({
  results,
  mode,
  question,
  onRunCustom,
  isRunning,
}) {
  const [activeTab, setActiveTab] = useState("results");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState(null);
  const [customRunning, setCustomRunning] = useState(false);

  const tabs = [
    { id: "results", label: "Test Results" },
    { id: "stdout", label: "Console" },
    { id: "custom", label: "Custom Input" },
  ];

  const handleRunCustom = async () => {
    if (!onRunCustom) return;
    setCustomRunning(true);
    setCustomOutput(null);
    try {
      const result = await onRunCustom(customInput);
      setCustomOutput(result);
      setActiveTab("custom");
    } finally {
      setCustomRunning(false);
    }
  };

  // Collect stdout/stderr from results
  const allStdout =
    results?.results
      ?.map((r) => r.actual)
      .filter(Boolean)
      .join("") || "";
  const allStderr =
    results?.results
      ?.map((r) => r.error)
      .filter(Boolean)
      .join("\n") || "";

  return (
    <div className="border-t border-border-main bg-bg-secondary shrink-0 h-[220px] flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border-subtle px-3 bg-bg-secondary shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-[0.75rem] font-semibold cursor-pointer
              border-b-2 transition-all duration-200
              ${
                activeTab === tab.id
                  ? "text-accent-blue border-b-accent-blue"
                  : "text-text-muted border-b-transparent hover:text-text-secondary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {/* Results tab */}
        {activeTab === "results" && (
          <>
            {!results ? (
              <div className="text-center py-5 text-text-muted text-[0.82rem]">
                Click <strong>Run Samples</strong> or <strong>Submit</strong> to
                see results
              </div>
            ) : (
              <div>
                {/* Summary bar */}
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 bg-bg-tertiary rounded mb-2.5 text-[0.8rem]">
                  <span className="text-accent-green font-bold font-mono">
                    {results.passed}
                  </span>
                  <span className="text-text-muted font-mono">
                    / {results.total}
                  </span>
                  <span className="text-text-muted text-[0.78rem]">
                    test cases passed
                  </span>
                  <div className="flex-1 h-1 bg-border-main rounded overflow-hidden">
                    <div
                      className="h-full rounded bg-gradient-to-r from-accent-blue to-accent-cyan transition-all duration-400"
                      style={{
                        width: `${
                          results.total > 0
                            ? (results.passed / results.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  {mode === "submit" && question ? (
                    <span className="text-accent-cyan font-mono text-[0.78rem]">
                      Score: {results.score}/{question.maxScore}
                    </span>
                  ) : (
                    <span className="text-text-muted text-[0.75rem]">
                      (sample only)
                    </span>
                  )}
                </div>

                {/* Result rows */}
                {results.results.map((r, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[100px_80px_1fr] gap-2 items-start
                      px-2.5 py-2 rounded mb-1.5 text-[0.78rem]
                      border bg-bg-card
                      ${
                        r.status === "AC"
                          ? "border-[rgba(46,204,143,0.3)]"
                          : r.status === "WA"
                          ? "border-[rgba(255,77,106,0.3)]"
                          : r.status === "TLE"
                          ? "border-[rgba(240,192,64,0.3)]"
                          : "border-[rgba(255,140,66,0.3)]"
                      }`}
                  >
                    <span className="font-mono font-semibold text-text-muted">
                      {r.label}
                    </span>
                    <span
                      className={`font-bold text-[0.72rem] tracking-[0.5px] px-1.5 py-0.5 rounded text-center ${
                        r.status === "AC"
                          ? "bg-[rgba(46,204,143,0.15)] text-status-ac"
                          : r.status === "WA"
                          ? "bg-[rgba(255,77,106,0.15)] text-status-wa"
                          : r.status === "TLE"
                          ? "bg-[rgba(240,192,64,0.15)] text-status-tle"
                          : "bg-[rgba(255,140,66,0.15)] text-status-re"
                      }`}
                    >
                      {r.status}
                    </span>
                    <div className="text-text-muted">
                      {r.status === "AC" && (
                        <span className="text-accent-green text-[0.75rem]">
                          Correct ✓
                        </span>
                      )}
                      {r.status === "WA" && (
                        <div className="text-[0.75rem]">
                          {r.isSample && (
                            <>
                              <span className="text-text-muted">Input: </span>
                              <code className="font-mono text-text-primary bg-bg-tertiary px-1 rounded text-[0.75rem]">
                                {r.input?.replace(/\n/g, " ↵ ")}
                              </code>
                              <br />
                            </>
                          )}
                          <span className="text-text-muted">Expected: </span>
                          <code className="font-mono text-text-primary bg-bg-tertiary px-1 rounded text-[0.75rem]">
                            {(r.expected || "").trim()}
                          </code>
                          <br />
                          <span className="text-text-muted">Got: </span>
                          <code className="font-mono text-accent-red bg-bg-tertiary px-1 rounded text-[0.75rem]">
                            {(r.actual || "").trim()}
                          </code>
                        </div>
                      )}
                      {(r.status === "RE" || r.status === "TLE") && (
                        <code className="font-mono text-accent-orange text-[0.75rem]">
                          {r.error || r.status}
                        </code>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Console tab */}
        {activeTab === "stdout" && (
          <>
            {!allStdout && !allStderr ? (
              <div className="text-center py-5 text-text-muted text-[0.82rem]">
                No output yet
              </div>
            ) : (
              <>
                {allStdout && (
                  <pre className="font-mono text-[0.8rem] text-text-secondary whitespace-pre-wrap leading-relaxed">
                    {allStdout}
                  </pre>
                )}
                {allStderr && (
                  <pre className="font-mono text-[0.8rem] text-accent-red whitespace-pre-wrap leading-relaxed mt-2">
                    {allStderr}
                  </pre>
                )}
              </>
            )}
          </>
        )}

        {/* Custom input tab */}
        {activeTab === "custom" && (
          <div className="flex flex-col gap-2 h-full">
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type your custom input here…"
              className="flex-1 bg-bg-tertiary border border-border-main rounded
                text-text-primary font-mono text-[0.8rem] p-2 resize-none outline-none
                min-h-[60px] focus:border-accent-blue transition-colors duration-200"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCustom}
                disabled={customRunning || isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-semibold
                  text-accent-cyan bg-bg-card border border-[rgba(15,240,200,0.3)] rounded
                  hover:bg-[rgba(15,240,200,0.1)] transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {customRunning ? (
                  <>
                    <Spinner size="sm" /> Running…
                  </>
                ) : (
                  "▷ Run"
                )}
              </button>
              <span className="text-[0.72rem] text-text-muted">
                Run your code against custom input
              </span>
            </div>
            {customOutput && (
              <pre
                className={`font-mono text-[0.8rem] whitespace-pre-wrap max-h-20 overflow-y-auto ${
                  customOutput.error ? "text-accent-red" : "text-text-secondary"
                }`}
              >
                {customOutput.error
                  ? customOutput.error
                  : customOutput.actual || "(no output)"}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
