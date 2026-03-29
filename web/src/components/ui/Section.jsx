/**
 * Reusable Section components for page layouts
 * Used across marketing and workspace pages
 */

/**
 * PageSection - Main content section with gradient background
 * Used in: ExamStartPageClient, PracticeQuestionBrowser, ResultsListClient, etc.
 */
export function PageSection({ children, className = "", variant = "default" }) {
  const variantClasses = {
    default: "bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)]",
    cyan: "bg-[radial-gradient(circle_at_top_left,rgba(15,240,200,0.16),transparent_35%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)]",
    simple: "bg-bg-secondary",
  };

  return (
    <section className={`overflow-hidden rounded-[28px] border border-border-main p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${variantClasses[variant]} ${className}`}>
      {children}
    </section>
  );
}

/**
 * SectionEyebrow - Small label above section titles
 */
export function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan ${className}`}>
      {children}
    </p>
  );
}

/**
 * SectionTitle - Large heading for sections
 */
export function SectionTitle({ children, className = "" }) {
  return (
    <h1 className={`mt-3 text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] text-text-primary ${className}`}>
      {children}
    </h1>
  );
}

/**
 * SectionDescription - Description text for sections
 */
export function SectionDescription({ children, className = "" }) {
  return (
    <p className={`mt-4 max-w-2xl text-[1rem] leading-7 text-text-secondary ${className}`}>
      {children}
    </p>
  );
}

/**
 * AsideSection - Sidebar section for complementary content
 */
export function AsideSection({ children, className = "" }) {
  return (
    <aside className={`self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${className}`}>
      {children}
    </aside>
  );
}

/**
 * AsideTitle - Title for aside sections
 */
export function AsideTitle({ children, eyebrow, className = "" }) {
  return (
    <>
      {eyebrow && (
        <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
          {eyebrow}
        </div>
      )}
      <h2 className={`mt-3 text-[1.8rem] font-bold text-text-primary ${className}`}>
        {children}
      </h2>
    </>
  );
}
