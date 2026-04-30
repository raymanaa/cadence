import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export const metadata = {
  title: "Pricing · Cadence",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section className="mx-auto w-full max-w-[1040px] px-6 pt-16 pb-10 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <span className="label">PRICING · BETA</span>
          <span className="mono text-[10.5px] text-ink-3">APRIL MMXXVI</span>
        </div>

        <h1 className="display mt-10 text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[64px]">
          Priced like <span className="display-italic">software.</span>
        </h1>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.75] text-ink-2">
          The individual AE pays for Cadence out of an expense budget. No
          quote, no IT ticket, no seat minimum.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1040px] px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Tier
            label="Solo"
            price="$19"
            cadence="/mo"
            quota="10 calls / mo"
            items={[
              "All coaching features",
              "Timestamped clip sharing",
              "7-day processing retention",
              "Export transcript + tags",
            ]}
          />
          <Tier
            label="Pro"
            price="$49"
            cadence="/mo"
            featured
            quota="40 calls / mo"
            items={[
              "Everything in Solo",
              "Priority processing",
              "30-day retention",
              "Monthly performance trend",
              "Private Slack coaching channel",
            ]}
          />
          <Tier
            label="Team"
            price="$19"
            cadence="/seat/mo"
            quota="Unlimited"
            items={[
              "Everything in Pro",
              "Manager rollup view",
              "Team talk-ratio leaderboard",
              "SSO + audit log",
              "Annual billing only",
            ]}
          />
        </div>

        <div className="mt-12 border border-dashed border-line-2 p-6">
          <div className="label">What counts as one call?</div>
          <p className="mt-2 max-w-[60ch] text-[13.5px] leading-[1.7] text-ink-2">
            One uploaded audio file up to 90 minutes. Longer files count as
            one additional call per started 90-minute block. Hobbyists will
            never hit the Solo cap; heavy reps typically outgrow it in
            month 2.
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Tier({
  label, price, cadence, quota, items, featured,
}: {
  label: string; price: string; cadence: string; quota: string;
  items: string[]; featured?: boolean;
}) {
  return (
    <div
      className={[
        "border bg-card p-6 flex flex-col",
        featured ? "border-ink" : "border-line",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between">
        <span className="label">{label}</span>
        {featured && <span className="label !text-[9.5px]" style={{ color: "var(--accent)" }}>POPULAR</span>}
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="display text-[44px] leading-none tabular-nums text-ink">{price}</span>
        <span className="mono text-[12px] text-ink-3">{cadence}</span>
      </div>
      <div className="mt-2 text-[13px] text-ink-2">{quota}</div>
      <ul className="mt-5 space-y-1.5 text-[13px] text-ink-2">
        {items.map((it) => (
          <li key={it} className="flex items-baseline gap-2">
            <span aria-hidden className="text-ink-3">—</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <div className="flex-1" />
      <Link
        href="/app/new/"
        className={[
          "mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12.5px] font-medium rounded-[3px] transition-colors",
          featured
            ? "bg-ink text-paper hover:bg-ink-2"
            : "border border-line text-ink hover:border-line-2 bg-paper",
        ].join(" ")}
      >
        Get started
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
