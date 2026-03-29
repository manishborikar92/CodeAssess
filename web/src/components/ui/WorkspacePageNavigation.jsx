import Link from "next/link";

function NavigationLink({ href, label, tone = "default" }) {
  const className =
    tone === "primary"
      ? "bg-gradient-to-br from-accent-blue to-[#3060d0] text-white hover:opacity-90"
      : "border border-border-main text-text-primary hover:bg-bg-hover";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-[0.82rem] font-semibold transition-colors duration-200 ${className}`}
    >
      {label}
    </Link>
  );
}

export default function WorkspacePageNavigation({
  backHref,
  backLabel = "Back",
  links = [],
  maxWidthClass = "max-w-[1180px]",
}) {
  return (
    <div className={`mx-auto pb-4 ${maxWidthClass}`}>
      <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-main bg-bg-secondary/90 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          <NavigationLink href="/" label="Home" />
          {backHref ? <NavigationLink href={backHref} label={backLabel} /> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <NavigationLink
              key={`${link.href}:${link.label}`}
              href={link.href}
              label={link.label}
              tone={link.tone}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
