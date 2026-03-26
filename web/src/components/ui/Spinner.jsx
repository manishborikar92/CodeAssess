export default function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={`
        ${sizeClasses[size] || sizeClasses.md}
        border-border-main border-t-accent-blue
        rounded-full animate-spin inline-block
        ${className}
      `}
    />
  );
}
