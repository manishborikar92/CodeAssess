import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border-main/50 bg-[rgba(10,13,20,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="rounded-2xl border border-border-main bg-bg-card p-2 transition-all duration-300 group-hover:border-accent-cyan/30 group-hover:shadow-[0_0_15px_rgba(15,240,200,0.1)]">
            <Image 
              src="/logo.svg" 
              alt="CodeAssess" 
              width={28} 
              height={28} 
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-[0.18em] text-text-primary transition-colors duration-300 group-hover:text-accent-cyan">
              CODEASSESS
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.14em] text-text-muted transition-colors duration-300 group-hover:text-text-secondary">
              Practice and Proctored Exams
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/practice"
            className="rounded-full border border-border-main px-4 py-2 text-[0.82rem] font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
          >
            Practice
          </Link>
          <Link
            href="/exam"
            className="rounded-full bg-gradient-to-br from-accent-blue to-[#3060d0] px-4 py-2 text-[0.82rem] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            Launch Exam
          </Link>
        </nav>
      </div>
    </header>
  );
}
