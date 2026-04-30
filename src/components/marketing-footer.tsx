import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-[1240px] px-6 py-14 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div>
            <div className="display text-[22px] text-ink leading-none">Cadence</div>
            <p className="mt-3 max-w-[340px] text-[13px] leading-[1.7] text-ink-2">
              Revenue-call intelligence. Upload a call, get timestamped
              coaching. Built for individual AEs, not IT procurement.
            </p>
          </div>
          <FooterCol label="Product">
            <FooterLink href="/app">Calls</FooterLink>
            <FooterLink href="/app/new">Upload</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
          </FooterCol>
          <FooterCol label="Company">
            <FooterLink href="/method">Method</FooterLink>
            <FooterLink href="/security">Security</FooterLink>
            <FooterLink href="/changelog">Changelog</FooterLink>
          </FooterCol>
          <FooterCol label="Context">
            <span className="text-ink-2">Built by Rayen Manaa</span>
            <span className="text-ink-2">Portfolio project #5</span>
            <a
              href="https://github.com/raymanaa/cadence"
              target="_blank"
              rel="noopener"
              className="text-ink-2 hover:text-ink transition-colors"
            >
              github.com/raymanaa/cadence ↗
            </a>
          </FooterCol>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-line pt-5 text-[11px] text-ink-3">
          <span className="mono">© 2026 Cadence · beta</span>
          <span className="mono">cadence.raymnz.com</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      <ul className="mt-3 flex flex-col gap-2 text-[13px]">
        {Array.isArray(children)
          ? children.map((c, i) => <li key={i}>{c}</li>)
          : <li>{children}</li>}
      </ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-ink-2 hover:text-ink transition-colors">
      {children}
    </Link>
  );
}
