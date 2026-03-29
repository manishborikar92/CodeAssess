/**
 * Reusable Panel components for content organization
 */

/**
 * InfoPanel - Panel for displaying information blocks with optional header
 * Used in: ExamStartScreen, JoinTokenForm, various info sections
 */
export function InfoPanel({ children, className = "", header, variant = "default" }) {
  const variantClasses = {
    default: "border-border-main bg-black/20",
    card: "border-border-main bg-bg-card",
    blue: "border-accent-blue/20 bg-[rgba(77,124,255,0.08)]",
    cyan: "border-accent-cyan/20 bg-[rgba(15,240,200,0.08)]",
    gold: "border-accent-gold/20 bg-[rgba(240,192,64,0.08)]",
  };

  return (
    <div className={`rounded-2xl border p-5 ${variantClasses[variant]} ${className}`}>
      {header && (
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-blue mb-3">
          {header}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * ListPanel - Panel with list items
 */
export function ListPanel({ children, className = "", header, variant = "default" }) {
  return (
    <InfoPanel header={header} variant={variant} className={className}>
      <ul className="space-y-2 text-[0.88rem] leading-6 text-text-secondary">
        {children}
      </ul>
    </InfoPanel>
  );
}

/**
 * NestedInfoBox - Nested information box within panels
 * Used in: ExamStartScreen (question assignment box)
 */
export function NestedInfoBox({ children, className = "", title }) {
  return (
    <div className={`rounded-2xl border border-border-subtle bg-bg-secondary/70 px-4 py-4 ${className}`}>
      {title && (
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
