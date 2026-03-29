/**
 * Reusable Banner components for alerts, notifications, and info boxes
 */

/**
 * AlertBanner - Colored notification banner with optional action button
 * Used in: ExamStartPageClient (active session alert)
 */
export function AlertBanner({ 
  action, 
  description, 
  title, 
  variant = "info" 
}) {
  const variantClasses = {
    info: "border-accent-cyan/20 bg-[rgba(15,240,200,0.06)] text-accent-cyan",
    warning: "border-accent-gold/20 bg-[rgba(240,192,64,0.06)] text-accent-gold",
    error: "border-accent-red/20 bg-[rgba(255,77,106,0.06)] text-accent-red",
    success: "border-accent-green/20 bg-[rgba(46,204,143,0.06)] text-accent-green",
  };

  return (
    <div className={`mb-4 rounded-3xl border px-5 py-4 ${variantClasses[variant]}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
            {title}
          </div>
          <div className="mt-2 text-sm leading-7 text-text-secondary">
            {description}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

/**
 * InfoBanner - Simple informational banner without actions
 */
export function InfoBanner({ children, variant = "default" }) {
  const variantClasses = {
    default: "border-border-main bg-bg-card",
    blue: "border-accent-blue/20 bg-[rgba(77,124,255,0.08)]",
    cyan: "border-accent-cyan/20 bg-[rgba(15,240,200,0.08)]",
    gold: "border-accent-gold/20 bg-[rgba(240,192,64,0.08)]",
    red: "border-accent-red/20 bg-[rgba(255,77,106,0.08)]",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
