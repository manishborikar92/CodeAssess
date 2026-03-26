import Link from "next/link";
import { getExamConfig } from "@/lib/api";

export default async function Home() {
  const config = await getExamConfig();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center overflow-auto animate-[fadeIn_0.4s_ease]">
      {/* Logo badge */}
      <div
        className="inline-flex items-center gap-2 bg-gradient-to-br from-[#1a2a50] to-[#0d1830]
        border border-border-bright rounded-full px-4 py-1.5
        text-[11px] tracking-[2px] uppercase text-accent-cyan font-mono mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-[pulse_2s_infinite]" />
        CodeAssess · Assessment Platform
      </div>

      {/* Hero title */}
      <h1 className="font-sans text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-tight leading-none text-center mb-2">
        Coding{" "}
        <span className="text-accent-blue">Assessment</span>
        <br />
        Platform
      </h1>

      <p className="text-base text-text-secondary font-normal text-center mb-10 max-w-lg">
        {config.totalQuestions} Questions · Python 3 · In-browser execution
        · Real exam simulation
      </p>

      {/* Info grid */}
      <div className="grid grid-cols-3 gap-3 mb-9 max-w-[500px] w-full px-4">
        <div className="bg-bg-card border border-border-main rounded-lg p-4 text-center">
          <div className="text-[1.6rem] font-bold text-accent-blue font-mono">
            {config.totalQuestions}
          </div>
          <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
            Questions
          </div>
        </div>
        <div className="bg-bg-card border border-border-main rounded-lg p-4 text-center">
          <div className="text-[1.6rem] font-bold text-accent-blue font-mono">
            {config.durationMinutes}
          </div>
          <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
            Minutes
          </div>
        </div>
        <div className="bg-bg-card border border-border-main rounded-lg p-4 text-center">
          <div className="text-[1.6rem] font-bold text-accent-blue font-mono">
            {config.totalScore}
          </div>
          <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
            Max Score
          </div>
        </div>
      </div>

      {/* Start button */}
      <Link
        href="/exam"
        className="bg-gradient-to-br from-accent-blue to-[#3060d0] text-white
          border-none rounded-lg px-12 py-3.5 text-base font-semibold
          tracking-wide shadow-[0_0_32px_rgba(77,124,255,0.3)]
          hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(77,124,255,0.45)]
          active:translate-y-0 transition-all duration-200
          no-underline inline-flex items-center gap-2"
      >
        ▶ &nbsp; Begin Exam
      </Link>

      <p className="mt-4 text-[0.72rem] text-text-muted text-center">
        Timer starts immediately · Python 3 · All test cases auto-graded
      </p>

      {/* Features section */}
      <div className="grid grid-cols-3 gap-4 mt-16 max-w-[720px] w-full px-4">
        <div className="bg-bg-card/50 border border-border-subtle rounded-lg p-5 text-center group hover:border-accent-blue/30 transition-all duration-300">
          <div className="text-2xl mb-2">🐍</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">In-Browser Python</h3>
          <p className="text-[0.72rem] text-text-muted leading-relaxed">
            Code runs locally via WebAssembly — no server needed
          </p>
        </div>
        <div className="bg-bg-card/50 border border-border-subtle rounded-lg p-5 text-center group hover:border-accent-cyan/30 transition-all duration-300">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Instant Feedback</h3>
          <p className="text-[0.72rem] text-text-muted leading-relaxed">
            Run samples or submit for full hidden test case evaluation
          </p>
        </div>
        <div className="bg-bg-card/50 border border-border-subtle rounded-lg p-5 text-center group hover:border-accent-green/30 transition-all duration-300">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Detailed Results</h3>
          <p className="text-[0.72rem] text-text-muted leading-relaxed">
            Per-question breakdown with AC/WA/TLE/RE verdicts
          </p>
        </div>
      </div>
    </div>
  );
}
