"use client";

import Link from "next/link";

export function MarketingNav() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <LogoMark />
          <span className="display text-[22px] leading-none text-ink">Cadence</span>
          <span className="label !text-[9px] hidden sm:inline">BETA</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] text-ink-2 md:flex">
          <Link href="/app" className="hover:text-ink transition-colors">
            Calls
          </Link>
          <Link href="/method" className="hover:text-ink transition-colors">
            Method
          </Link>
          <Link href="/pricing" className="hover:text-ink transition-colors">
            Pricing
          </Link>
          <Link href="/security" className="hover:text-ink transition-colors">
            Security
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] text-ink-2 hover:text-ink transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/app/new"
            className="inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-[12.5px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors"
          >
            <span>Upload a call</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="relative flex h-5 w-5 items-center justify-center"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5">
        <rect x="2" y="8" width="2" height="4" fill="var(--lane-rep)" />
        <rect x="5" y="5" width="2" height="10" fill="var(--lane-rep)" />
        <rect x="8" y="3" width="2" height="14" fill="var(--accent)" />
        <rect x="11" y="6" width="2" height="8" fill="var(--lane-prospect)" />
        <rect x="14" y="8" width="2" height="4" fill="var(--lane-prospect)" />
      </svg>
    </span>
  );
}
