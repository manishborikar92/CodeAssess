"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
];

const PRODUCT_NAV = [
  { href: "/practice", label: "Practice" },
  { href: "/join", label: "Join" },
  { href: "/results", label: "Results" },
];

function NavLink({ href, isActive, label }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-[0.82rem] font-semibold transition-colors duration-200 ${
        isActive
          ? "bg-[rgba(77,124,255,0.12)] text-text-primary"
          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border-main/60 bg-[rgba(10,13,20,0.82)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="rounded-2xl border border-border-main bg-bg-card p-2 transition-all duration-300 group-hover:border-accent-cyan/30">
            <Image
              src="/logo.svg"
              alt="CodeAssess"
              width={28}
              height={28}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-[0.18em] text-text-primary transition-colors duration-300 group-hover:text-accent-cyan">
              CODEASSESS
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.14em] text-text-muted">
              Practice and secure coding assessments
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            {PRODUCT_NAV.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          <Link
            href="/exam"
            className="rounded-full bg-gradient-to-br from-accent-blue to-[#3060d0] px-4 py-2 text-[0.82rem] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            Launch Exam
          </Link>
        </div>
      </div>
    </header>
  );
}
