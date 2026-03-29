/**
 * Reusable Card components for consistent UI patterns across the application
 */

/**
 * StatCard - Display metrics with value, label, and optional caption
 * Used in: ExamStartScreen, PracticeQuestionBrowser, PracticeProgressPage, ResultsListClient
 */
export function StatCard({ label, value, caption, summary }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="font-mono text-[1.6rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
      {(caption || summary) && (
        <p className="mt-2 text-[0.82rem] leading-6 text-text-secondary">
          {caption || summary}
        </p>
      )}
    </div>
  );
}

/**
 * MetricCard - Simplified version for hero sections
 * Used in: HeroSection
 */
export function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card/80 p-4">
      <div className="font-mono text-[1.7rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
    </div>
  );
}

/**
 * FeatureCard - Display features with eyebrow, title, and summary
 * Used in: FeatureSection
 */
export function FeatureCard({ eyebrow, summary, title }) {
  return (
    <article className="rounded-2xl border border-border-main bg-bg-secondary p-5">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-blue">
        {eyebrow}
      </div>
      <h3 className="mt-3 text-[1.15rem] font-bold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">{summary}</p>
    </article>
  );
}

/**
 * StepCard - Display numbered steps or instructions
 * Used in: JoinTokenForm, help pages
 */
export function StepCard({ description, label, title }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue">
        {label}
      </div>
      <div className="mt-3 text-[1rem] font-semibold text-text-primary">{title}</div>
      <p className="mt-2 text-[0.84rem] leading-6 text-text-secondary">{description}</p>
    </div>
  );
}

/**
 * HelpCard - Simple card for help/documentation sections
 * Used in: Help page
 */
export function HelpCard({ description, title }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-secondary p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
      <h3 className="text-[1.08rem] font-semibold text-text-primary">{title}</h3>
      <p className="mt-3 text-[0.9rem] leading-7 text-text-secondary">{description}</p>
    </div>
  );
}

/**
 * InfoCard - Generic card with optional accent color
 * Used across multiple components for displaying information blocks
 */
export function InfoCard({ children, className = "", variant = "default" }) {
  const variantClasses = {
    default: "border-border-main bg-bg-card",
    blue: "border-accent-blue/20 bg-[rgba(77,124,255,0.08)]",
    cyan: "border-accent-cyan/20 bg-[rgba(15,240,200,0.08)]",
    gold: "border-accent-gold/20 bg-[rgba(240,192,64,0.08)]",
  };

  return (
    <div className={`rounded-2xl border p-4 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
