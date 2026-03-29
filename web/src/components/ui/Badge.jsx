/**
 * Reusable Badge components for status indicators and labels
 */

/**
 * Badge - Generic badge component with tone variants
 * Used in: WorkspaceHeader, various status indicators
 */
export function Badge({ children, className = "", tone = "neutral", variant = "default" }) {
  const toneClasses = {
    neutral: "border-border-main text-text-primary",
    primary: "border-accent-blue/30 bg-[rgba(77,124,255,0.12)] text-accent-blue",
    cyan: "border-accent-cyan/30 bg-[rgba(15,240,200,0.12)] text-accent-cyan",
    gold: "border-accent-gold/30 bg-[rgba(240,192,64,0.12)] text-accent-gold",
    success: "border-accent-green/30 bg-[rgba(46,204,143,0.12)] text-accent-green",
    warning: "border-accent-gold text-accent-gold",
    critical: "border-accent-red text-accent-red",
    error: "border-accent-red/30 bg-[rgba(255,77,106,0.12)] text-accent-red",
  };

  const variantClasses = {
    default: "rounded-xl border bg-bg-card px-3 py-2 font-mono text-[0.8rem] font-semibold",
    pill: "rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
    small: "rounded-full border px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em]",
  };

  return (
    <div className={`${variantClasses[variant]} ${toneClasses[tone]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * DifficultyBadge - Specialized badge for question difficulty
 * Used in: QuestionSidebar, ProblemPanel, question lists
 */
export function DifficultyBadge({ difficulty, className = "" }) {
  const difficultyClasses = {
    easy: "bg-[rgba(46,204,143,0.12)] text-diff-easy",
    medium: "bg-[rgba(240,192,64,0.12)] text-diff-medium",
    hard: "bg-[rgba(255,77,106,0.12)] text-diff-hard",
  };

  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.5px] ${difficultyClasses[difficulty]} ${className}`}>
      {difficulty}
    </span>
  );
}

/**
 * StatusDot - Small colored dot for status indication
 * Used in: QuestionSidebar
 */
export function StatusDot({ status, title, className = "" }) {
  const statusClasses = {
    completed: "bg-accent-green border-accent-green",
    partial: "bg-accent-gold border-accent-gold",
    expired: "bg-accent-red border-accent-red",
    "in-progress": "bg-accent-blue border-accent-blue",
    "not-started": "bg-transparent border-border-bright",
  };

  return (
    <span
      title={title}
      className={`h-[7px] w-[7px] shrink-0 rounded-full border ${statusClasses[status] || statusClasses["not-started"]} ${className}`}
    />
  );
}
