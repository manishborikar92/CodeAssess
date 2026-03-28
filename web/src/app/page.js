import Image from "next/image";
import Link from "next/link";
import { getPracticeConfig } from "@/lib/api";

export default async function Home() {
  const config = await getPracticeConfig();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center overflow-auto animate-[fadeIn_0.4s_ease]">
      <div
        className="inline-flex items-center bg-gradient-to-br from-[#1a2a50] to-[#0d1830]
        border border-border-bright rounded-full px-4 py-1.5
        text-[11px] tracking-[2px] uppercase text-text-primary font-mono mb-8"
      >
        <Image
          src="/logo.svg"
          alt="CodeAssess Logo"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="font-bold text-white tracking-[2px]">
          Code<span className="text-accent-cyan">Assess</span>
        </span>
        <span className="text-text-muted ml-2">Practice Workspace</span>
      </div>

      <h1 className="font-sans text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-tight leading-none text-center mb-2">
        Solve Coding
        <span className="text-accent-blue"> Questions</span>
        <br />
        On Your Terms
      </h1>

      <p className="text-base text-text-secondary font-normal text-center mb-10 max-w-lg">
        {config.totalQuestions} questions, Python 3, in-browser execution, and a
        dedicated {config.questionTimeLimitMinutes}-minute timer for every question
        you open.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-9 max-w-[560px] w-full px-4">
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
            {config.questionTimeLimitMinutes}
          </div>
          <div className="text-[0.72rem] text-text-muted uppercase tracking-[1px] mt-1">
            Minutes Each
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

      <Link
        href="/practice"
        className="bg-gradient-to-br from-accent-blue to-[#3060d0] text-white
          border-none rounded-lg px-12 py-3.5 text-base font-semibold
          tracking-wide shadow-[0_0_32px_rgba(77,124,255,0.3)]
          hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(77,124,255,0.45)]
          active:translate-y-0 transition-all duration-200
          no-underline inline-flex items-center gap-2"
      >
        Open Practice Workspace
      </Link>

      <p className="mt-4 text-[0.72rem] text-text-muted text-center">
        Pick any question, switch freely, and track progress as you go.
      </p>

      <div className="grid grid-cols-3 gap-4 mt-16 max-w-[760px] w-full px-4">
        <div className="bg-bg-card/50 border border-border-subtle rounded-lg p-5 text-center group hover:border-accent-blue/30 transition-all duration-300">
          <div className="text-2xl mb-2">Py</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            In-Browser Python
          </h3>
          <p className="text-[0.72rem] text-text-muted leading-relaxed">
            Code runs locally via WebAssembly with no backend required today.
          </p>
        </div>

        <div className="bg-bg-card/50 border border-border-subtle rounded-lg p-5 text-center group hover:border-accent-cyan/30 transition-all duration-300">
          <div className="text-2xl mb-2">Go</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Free-Form Solving
          </h3>
          <p className="text-[0.72rem] text-text-muted leading-relaxed">
            Start with any question, move between them freely, and keep your drafts.
          </p>
        </div>

        <div className="bg-bg-card/50 border border-border-subtle rounded-lg p-5 text-center group hover:border-accent-green/30 transition-all duration-300">
          <div className="text-2xl mb-2">30</div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Per-Question Limit
          </h3>
          <p className="text-[0.72rem] text-text-muted leading-relaxed">
            Every question carries its own timer, keeping practice focused without a
            single fixed exam session.
          </p>
        </div>
      </div>
    </div>
  );
}
