/**
 * Reusable Button components for consistent interactions
 */

/**
 * Button - Primary button component with variants
 */
export function Button({ 
  children, 
  className = "", 
  disabled = false, 
  onClick, 
  type = "button",
  variant = "primary",
  size = "md"
}) {
  const variantClasses = {
    primary: "bg-gradient-to-br from-accent-blue to-[#3060d0] text-white hover:opacity-90",
    secondary: "border border-border-main text-text-primary hover:bg-bg-hover",
    danger: "bg-gradient-to-br from-accent-red to-[#d03030] text-white hover:opacity-90",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-[0.76rem]",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * IconButton - Button with icon, used in headers and toolbars
 */
export function IconButton({
  ariaLabel,
  children,
  className = "",
  disabled = false,
  icon: Icon,
  onClick,
  title,
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title || ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-transparent text-text-secondary transition-all duration-200 hover:border-border-bright hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35 ${className}`}
    >
      {Icon ? <Icon size={20} strokeWidth={2.1} /> : children}
    </button>
  );
}

/**
 * LinkButton - Button styled as a link
 */
export function LinkButton({ children, className = "", href, variant = "secondary" }) {
  const variantClasses = {
    primary: "bg-gradient-to-br from-accent-blue to-[#3060d0] text-white hover:opacity-90",
    secondary: "border border-border-main text-text-primary hover:bg-bg-hover",
  };

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
