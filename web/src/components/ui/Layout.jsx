/**
 * Reusable Layout components for consistent page structure
 */

/**
 * PageContainer - Main page wrapper with consistent padding
 */
export function PageContainer({ children, className = "" }) {
  return (
    <div className={`min-h-screen overflow-y-auto bg-bg-primary px-6 py-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * ContentWrapper - Centered content wrapper with max-width
 */
export function ContentWrapper({ children, className = "", maxWidth = "1180px" }) {
  return (
    <div className={`mx-auto max-w-[${maxWidth}] ${className}`}>
      {children}
    </div>
  );
}

/**
 * TwoColumnLayout - Two-column grid layout (main + sidebar)
 * Used extensively across exam, practice, results pages
 */
export function TwoColumnLayout({ 
  children, 
  className = "", 
  mainContent, 
  sidebar,
  variant = "default" 
}) {
  const variantClasses = {
    default: "lg:grid-cols-[minmax(0,1.15fr)_380px]",
    balanced: "lg:grid-cols-2",
    wide: "lg:grid-cols-[minmax(0,1.15fr)_360px]",
  };

  if (children) {
    return (
      <div className={`mx-auto grid max-w-[1180px] items-start gap-6 ${variantClasses[variant]} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`mx-auto grid max-w-[1180px] items-start gap-6 ${variantClasses[variant]} ${className}`}>
      {mainContent}
      {sidebar}
    </div>
  );
}

/**
 * HeroCard - Large hero-style card with gradient background
 * Used in: Exam start, practice browser, results list, join form
 */
export function HeroCard({ children, className = "", variant = "default" }) {
  const variantClasses = {
    default: "bg-[radial-gradient(circle_at_top_left,rgba(77,124,255,0.22),transparent_42%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)]",
    cyan: "bg-[radial-gradient(circle_at_top_left,rgba(15,240,200,0.16),transparent_35%),linear-gradient(180deg,#131a2a_0%,#0d111c_100%)]",
  };

  return (
    <section className={`overflow-hidden rounded-[28px] border border-border-main p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${variantClasses[variant]} ${className}`}>
      {children}
    </section>
  );
}

/**
 * SidePanel - Sidebar panel for complementary content
 * Used in: Exam start, practice browser, results list, join form
 */
export function SidePanel({ children, className = "" }) {
  return (
    <aside className={`self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${className}`}>
      {children}
    </aside>
  );
}
