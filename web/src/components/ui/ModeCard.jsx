import Link from "next/link";
import { InfoPanel } from "./Panel";

/**
 * ModeCard - Card for displaying different modes/flows with CTA
 * Used in: ModeSection
 */
export function ModeCard({ ctaHref, ctaLabel, eyebrow, summary, title, bullets, tone }) {
  const accentClass =
    tone === "exam"
      ? "text-accent-blue border-accent-blue/20 bg-[rgba(77,124,255,0.08)]"
      : "text-accent-cyan border-accent-cyan/20 bg-[rgba(15,240,200,0.08)]";

  return (
    <article className="rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${accentClass}`}>
        {eyebrow}
      </div>
      <h3 className="mt-4 text-[1.7rem] font-bold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.94rem] leading-7 text-text-secondary">{summary}</p>

      <div className="mt-5 space-y-3">
        {bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-2xl border border-border-subtle bg-bg-card px-4 py-3 text-[0.86rem] leading-6 text-text-secondary"
          >
            {bullet}
          </div>
        ))}
      </div>

      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-2xl border border-border-main px-4 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-hover"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
