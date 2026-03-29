"use client";

import { useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import Spinner from "@/components/ui/Spinner";

export default function CodePanel({
  code,
  onCodeChange,
  onReset,
  onRun,
  onSubmit,
  isRunning,
  runningMode,
  pyodideReady,
  isDisabled,
  disabledMessage,
}) {
  useEffect(() => {
    const handler = (event) => {
      if (isDisabled) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!isRunning && pyodideReady) {
          onRun();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        if (!isRunning && pyodideReady) {
          onSubmit();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isDisabled, isRunning, onRun, onSubmit, pyodideReady]);

  const handleChange = useCallback(
    (value) => {
      if (!isDisabled) {
        onCodeChange(value);
      }
    },
    [isDisabled, onCodeChange]
  );

  const disableActions = isRunning || !pyodideReady || isDisabled;

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-secondary border-b border-border-main shrink-0 gap-2">
        <div className="flex items-center gap-1.5 bg-bg-card border border-border-main rounded px-2.5 py-1 font-mono text-[0.75rem] text-accent-cyan font-medium">
          <span className="text-[0.85rem]">Py</span>
          Python 3
        </div>

        <div className="flex gap-1.5 items-center">
          <button
            onClick={onReset}
            disabled={isRunning || isDisabled}
            className="px-3 py-1.5 text-[0.72rem] font-semibold text-text-muted border border-border-subtle rounded
              bg-transparent hover:text-accent-red hover:border-accent-red transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Reset
          </button>

          <button
            onClick={onRun}
            disabled={disableActions}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[0.78rem] font-semibold
              text-accent-cyan bg-bg-card border border-[rgba(15,240,200,0.3)] rounded
              hover:bg-[rgba(15,240,200,0.1)] transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning && runningMode === "run" ? (
              <>
                <Spinner size="sm" />
                Running...
              </>
            ) : (
              "Run Samples"
            )}
          </button>

          <button
            onClick={onSubmit}
            disabled={disableActions}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[0.78rem] font-bold
              text-white bg-gradient-to-br from-accent-blue to-[#3060d0] border-none rounded
              hover:opacity-90 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning && runningMode === "submit" ? (
              <>
                <Spinner size="sm" />
                Judging...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      {disabledMessage && (
        <div className="px-4 py-2 text-[0.75rem] text-accent-red bg-[rgba(255,77,106,0.08)] border-b border-[rgba(255,77,106,0.18)]">
          {disabledMessage}
        </div>
      )}

      <CodeMirror
        className="flex-1 overflow-hidden min-h-0 flex flex-col text-[13.5px]"
        value={code}
        onChange={handleChange}
        theme={oneDark}
        extensions={[python()]}
        height="100%"
        editable={!isDisabled}
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
  );
}
