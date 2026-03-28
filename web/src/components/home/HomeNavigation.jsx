import Image from "next/image";
import Link from "next/link";

export default function HomeNavigation() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-[rgba(10,13,20,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="rounded-2xl border border-border-main bg-bg-card p-2">
            <Image src="/logo.svg" alt="CodeAssess" width={28} height={28} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-[0.18em] text-text-primary">
              CODEASSESS
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.14em] text-text-muted">
              Practice and Proctored Exams
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
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
