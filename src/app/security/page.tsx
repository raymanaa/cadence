import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export const metadata = {
  title: "Security · Cadence",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />
      <section className="mx-auto w-full max-w-[960px] px-6 pt-16 pb-10 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <span className="label">SECURITY · BETA DISCLOSURE</span>
          <span className="mono text-[10.5px] text-ink-3">APRIL MMXXVI</span>
        </div>

        <h1 className="display mt-10 text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[64px]">
          Honest about <span className="display-italic">beta.</span>
        </h1>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.75] text-ink-2">
          Cadence is a self-serve beta. The posture below reflects where we
          actually are, not where we would be if we were selling into a
          regulated buyer. If your calls contain PHI, PII beyond names and
          companies, or material non-public information, wait for v2.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <Section title="Audio handling">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— Your audio is only ever processed on upload; never retained in a training set.</li>
              <li>— Raw audio is deleted from the processing pipeline within 24 hours.</li>
              <li>— The transcript, tags, and clips are kept in your private library.</li>
              <li>— No cross-customer signal. Your calls do not inform coaching for anyone else.</li>
            </ul>
          </Section>
          <Section title="Access">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— Individual accounts only in beta; no team-scoping yet.</li>
              <li>— Shared clips are unguessable URLs. Anyone with the URL can play.</li>
              <li>— Revocation (&quot;delete this clip&quot;) is a single click and propagates immediately.</li>
            </ul>
          </Section>
          <Section title="What we don't have yet">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— SOC 2 attestation.</li>
              <li>— BAA / HIPAA posture.</li>
              <li>— SSO / SCIM.</li>
              <li>— Retention policy configuration.</li>
            </ul>
            <p className="mt-3 text-[11.5px] italic text-ink-3">
              We ship these in order when a paying customer blocks on them.
              We will not lie about having them in the meantime.
            </p>
          </Section>
          <Section title="Pipeline signing">
            <ul className="space-y-2 text-[13px] leading-[1.7] text-ink-2">
              <li>— Every call is tagged with the pipeline version that processed it.</li>
              <li>— Coaching tags on older calls are reproducible on demand.</li>
              <li>— A model upgrade creates a new pipeline version, not silent re-coaching.</li>
            </ul>
          </Section>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-5 text-[12px] text-ink-3">
          <span className="mono tracking-[0.14em]">SECURITY CONTACT · security@cadence.beta</span>
          <span className="mono">last updated · 2026-04-21</span>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink md:text-[26px]">
        {title}<span className="display-italic">.</span>
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
