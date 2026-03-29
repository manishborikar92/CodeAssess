/**
 * Reusable Table components for consistent data display
 * Used in: PracticeQuestionBrowser, PracticeProgressPage, ResultsListClient, ExamResultsScreen
 */

/**
 * TableContainer - Wrapper for table sections with header
 */
export function TableContainer({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)] ${className}`}>
      {children}
    </div>
  );
}

/**
 * TableHeader - Header section above table with title and optional actions
 */
export function TableHeader({ title, description, actions, metadata }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border-subtle px-6 py-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-[1.1rem] font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-[0.82rem] text-text-secondary">{description}</p>
        )}
      </div>
      {metadata && (
        <div className="font-mono text-[0.78rem] text-text-muted">{metadata}</div>
      )}
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Table - Main table component with consistent styling
 */
export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full ${className}`}>{children}</table>
    </div>
  );
}

/**
 * TableHead - Table header with consistent styling
 */
export function TableHead({ children }) {
  return (
    <thead className="bg-bg-tertiary text-left text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
      {children}
    </thead>
  );
}

/**
 * TableBody - Table body wrapper
 */
export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

/**
 * TableRow - Table row with hover effect
 */
export function TableRow({ children, className = "", isHighlighted = false }) {
  return (
    <tr
      className={`border-t border-border-subtle text-[0.84rem] transition-colors duration-200 hover:bg-bg-hover ${
        isHighlighted ? "bg-[rgba(77,124,255,0.08)]" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

/**
 * TableCell - Table cell with consistent padding
 */
export function TableCell({ children, className = "", align = "left" }) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  return <td className={`px-4 py-4 ${alignClass} ${className}`}>{children}</td>;
}

/**
 * TableHeaderCell - Table header cell
 */
export function TableHeaderCell({ children, className = "", align = "left" }) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  return <th className={`px-4 py-3 ${alignClass} ${className}`}>{children}</th>;
}
