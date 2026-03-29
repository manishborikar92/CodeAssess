import Link from "next/link";

const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { href: "/practice", label: "Practice Workspace" },
      { href: "/exam", label: "Secure Exam" },
      { href: "/results", label: "Results" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/join", label: "Join With Token" },
      { href: "/about", label: "About CodeAssess" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-main/70 px-6 py-12">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent-cyan">
            CodeAssess
          </div>
          <h2 className="mt-3 text-[1.9rem] font-bold text-text-primary">
            One product surface for rehearsal, delivery, and review
          </h2>
          <p className="mt-4 max-w-2xl text-[0.9rem] leading-7 text-text-secondary">
            CodeAssess keeps practice and exam flows clearly separated while sharing a
            consistent interface, route-driven navigation, and repository-backed client
            persistence. All public routes are available without authentication today.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                {group.title}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[0.86rem] text-text-secondary transition-colors duration-200 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1200px] flex-col gap-3 border-t border-border-main/50 pt-6 text-[0.82rem] text-text-muted md:flex-row md:items-center md:justify-between">
        <div>© {currentYear} CodeAssess.</div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span>
            A product by{' '}
            <a 
              href="https://vaelix.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-accent-cyan transition-colors duration-200 hover:text-accent-blue"
            >
              Vaelix
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
