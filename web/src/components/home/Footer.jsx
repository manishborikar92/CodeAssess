import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-[0.82rem] text-text-muted md:flex-row md:items-center md:justify-between">
        <div>CodeAssess modernizes practice and secure browser-based coding exams in one product surface.</div>
        <div className="flex items-center gap-4">
          <Link href="/practice" className="transition-colors duration-200 hover:text-text-primary">
            Practice
          </Link>
          <Link href="/exam" className="transition-colors duration-200 hover:text-text-primary">
            Exam
          </Link>
        </div>
      </div>
    </footer>
  );
}
