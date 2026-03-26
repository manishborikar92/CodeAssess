"use client";

import { useRef, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import Spinner from "@/components/ui/Spinner";

export default function CodePanel({
  question,
  code,
  onCodeChange,
  onRun,
  onSubmit,
  onReset,
  isRunning,
  runningMode,
  pyodideReady,
}) {
  const editorRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isRunning && pyodideReady) onRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning && pyodideReady) onSubmit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // Prevent browser save dialog
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isRunning, pyodideReady, onRun, onSubmit]);

  const handleChange = useCallback(
    (value) => {
      onCodeChange(value);
    },
    [onCodeChange]
  );

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-secondary border-b border-border-main shrink-0 gap-2">
        {/* Language badge */}
        <div className="flex items-center gap-1.5 bg-bg-card border border-border-main rounded px-2.5 py-1 font-mono text-[0.75rem] text-accent-cyan font-medium">
          <span className="text-[0.85rem]">🐍</span>
          Python 3
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 items-center">
          <button
            onClick={onReset}
            disabled={isRunning}
            className="px-3 py-1.5 text-[0.72rem] font-semibold text-text-muted border border-border-subtle rounded
              bg-transparent hover:text-accent-red hover:border-accent-red transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ↺ Reset
          </button>
          <button
            onClick={onRun}
            disabled={isRunning || !pyodideReady}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[0.78rem] font-semibold
              text-accent-cyan bg-bg-card border border-[rgba(15,240,200,0.3)] rounded
              hover:bg-[rgba(15,240,200,0.1)] transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning && runningMode === "run" ? (
              <>
                <Spinner size="sm" />
                Running…
              </>
            ) : (
              "▷ Run Samples"
            )}
          </button>
          <button
            onClick={onSubmit}
            disabled={isRunning || !pyodideReady}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[0.78rem] font-bold
              text-white bg-gradient-to-br from-accent-blue to-[#3060d0] border-none rounded
              hover:opacity-90 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning && runningMode === "submit" ? (
              <>
                <Spinner size="sm" />
                Judging…
              </>
            ) : (
              "✓ Submit"
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden min-h-0" ref={editorRef}>
        <CodeMirror
          value={code}
          onChange={handleChange}
          theme={oneDark}
          extensions={[python()]}
          height="100%"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            indentOnInput: true,
            foldGutter: false,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
