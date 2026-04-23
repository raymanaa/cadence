import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { CALLS } from "@/lib/calls";

export default function Landing() {
  const call = CALLS[0];
  const tag = call.coaching.find((t) => t.severity === "critical") ?? call.coaching[0];
  const mins = Math.floor(tag.atSec / 60);
  const secs = tag.atSec % 60;
  const timestamp = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const recent = CALLS.slice(0, 4);

  const tone =
    tag.severity === "critical"
      ? "var(--crit, var(--accent))"
      : tag.severity === "warn"
        ? "var(--warn, var(--accent))"
        : "var(--ok, var(--accent))";

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section>
        <div className="mx-auto max-w-[1080px] px-6 md:px-10 pt-24 pb-20 md:pt-32">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16">
            <div>
              <div className="label">Revenue-call intelligence</div>
              <h1 className="display mt-5 text-[64px] leading-[0.96] tracking-[-0.018em] md:text-[96px]">
                Coach every rep.{" "}
                <span className="display-italic" style={{ color: "var(--accent)" }}>On every call.</span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-ink-2">
                Upload the call. Cadence returns timestamped coaching — with evidence, not vibes.
              </p>
              <div className="mt-8">
                <Link href="/app/new" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[3px] hover:bg-ink-2 transition-colors">
                  Upload a call
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div className="border border-line bg-card rounded-[4px] p-5">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[10px] text-ink-3 tracking-[0.12em]">{call.company} · {call.stage}</span>
                <span className="mono text-[10px] font-semibold tracking-[0.14em]" style={{ color: tone }}>{tag.severity.toUpperCase()}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="mono text-[22px] tabular-nums text-ink leading-none">{timestamp}</span>
                <div className="display text-[19px] text-ink leading-tight">{tag.title}</div>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-[1.6] text-ink-2 italic">{tag.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat n="per moment" label="Coaching at the second, not the deal" />
          <Stat n="every" label="Call reviewed, not just the long ones" />
          <Stat n="talk ratio" label="Rep vs. prospect, minute by minute" />
          <Stat n="0" label="Pre-canned rubrics you can&apos;t edit" />
        </div>
      </section>

      <Section label="The coaching-quarter problem">
        <p className="display-italic text-[30px] leading-[1.25] text-ink max-w-[34ch] md:text-[42px]">
          Coaching happens once a quarter. Calls happen forty times a week.
        </p>
        <p className="mt-6 max-w-[60ch] text-[15px] leading-[1.7] text-ink-2">
          By the time a rep sees their manager&apos;s notes on the January call, it&apos;s April. Cadence flags the moment in the first call after the call ends — timestamped, transcript-linked, actionable before the next dial.
        </p>
      </Section>

      <Section label="How a call becomes coaching">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <Move n="01" verb="Upload" detail="Any recording format. Gong, Chorus, Zoom, Otter, plain mp4. No installer." />
          <Move n="02" verb="Transcribe" detail="Speaker-separated, punctuated, timestamped to the word." />
          <Move n="03" verb="Tag" detail="Coaching moments at the second: interrupted the prospect, missed a buying signal, didn&apos;t price-anchor." />
          <Move n="04" verb="Score" detail="Against your rubric. Talk ratio, listening time, deal-stage adherence." />
          <Move n="05" verb="Ship" detail="To the rep&apos;s inbox. Timestamp-linked to the transcript; one click replays the moment." />
        </ol>
      </Section>

      <Section label="Three things only Cadence does">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature title="Moment-level, not recap-level." body="Not &quot;the rep talked too much.&quot; &quot;At 04:17 the rep talked over the prospect&apos;s pricing question.&quot;" />
          <Feature title="Your rubric, not ours." body="Every coaching tag is anchored in a rule you wrote. Change the rule; change what gets flagged." />
          <Feature title="Deal-stage aware." body="A missed close in a discovery call is fine. In a closing call it&apos;s a problem. Cadence knows the difference." />
        </div>
      </Section>

      <Section label="Made for">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px] leading-[1.65] text-ink-2">
          <Persona title="The rep">Gets the timestamped note after the call. Changes the opening on the next dial. Doesn&apos;t wait for QBR.</Persona>
          <Persona title="The sales manager">Used to listen to 3 calls a week. Now reads the moment-tags across 40, with replay-on-click.</Persona>
          <Persona title="The enablement lead">Writes the rubric. Ships it once; every call is checked against it automatically.</Persona>
        </ul>
      </Section>

      <Section label="Calls this week" right={<Link href="/app" className="mono text-[11px] text-ink-3 hover:text-ink transition-colors">all calls →</Link>}>
        <ul className="border-y border-line divide-y divide-line">
          {recent.map((c) => (
            <li key={c.id}>
              <Link href={`/app/${c.slug}/`} className="group grid grid-cols-[auto_1fr_auto] gap-5 py-4 items-baseline hover:bg-paper-2/40 transition-colors px-1">
                <span className="mono text-[10px] tracking-[0.14em] text-ink-3">{c.stage.toUpperCase()}</span>
                <div>
                  <div className="display text-[18px] text-ink leading-tight">{c.company}.</div>
                  <div className="text-[11.5px] text-ink-3 mt-0.5">{c.rep.name} · {c.coaching.length} coaching moments · score {c.score}</div>
                </div>
                <span className="mono text-[10.5px] text-ink-3 group-hover:text-ink">open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <section className="mx-auto max-w-[1080px] px-6 md:px-10 py-16">
        <blockquote className="border-l-2 pl-6 max-w-[60ch]" style={{ borderColor: "var(--accent)" }}>
          <p className="display-italic text-[28px] leading-[1.3] text-ink md:text-[34px]">
            &ldquo;The first call I got the tags back, I changed my opening on the next one. That&apos;s never happened with quarterly coaching.&rdquo;
          </p>
          <footer className="mt-4 smallcaps mono text-[11px] text-ink-3 tracking-[0.14em]">
            — J. Okafor · account executive · &lt;pilot · not a customer&gt;
          </footer>
        </blockquote>
      </section>

      <Section label="Questions">
        <dl className="divide-y divide-line border-y border-line">
          <Faq q="What recording platforms do you support?">Gong, Chorus, Zoom, Otter, plain audio/video uploads. The wrapper is a URL; no installer.</Faq>
          <Faq q="Is this a Gong replacement?">No. Gong records. Cadence analyzes. If Gong is your source-of-truth, Cadence sits on top.</Faq>
          <Faq q="What about consent?">Cadence does not record. It reads recordings you already made with consent. Transcription is stored per your retention policy.</Faq>
          <Faq q="Languages?">English at v0.9. Spanish and French tracked in /changelog.</Faq>
          <Faq q="Can I customize the rubric?">Yes. Your rubric is a versioned YAML; updates propagate to every subsequent call.</Faq>
        </dl>
      </Section>

      <section className="border-t-2 border-ink">
        <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-20 text-center">
          <div className="label">Next call</div>
          <h2 className="display mt-3 text-[40px] leading-[1.05] tracking-[-0.018em] text-ink md:text-[54px]">
            Tagged.{" "}
            <span className="display-italic" style={{ color: "var(--accent)" }}>By the minute.</span>
          </h2>
          <div className="mt-8">
            <Link href="/app/new" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[3px] hover:bg-ink-2 transition-colors">
              Upload a call
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Section({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-16">
        <div className="flex items-baseline justify-between border-b border-line pb-3 mb-8">
          <span className="label">{label}</span>
          {right}
        </div>
        {children}
      </div>
    </section>
  );
}
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="display text-[28px] leading-none tabular-nums text-ink md:text-[32px]">{n}</div>
      <div className="mt-2 text-[11.5px] leading-[1.45] text-ink-3 max-w-[28ch]">{label}</div>
    </div>
  );
}
function Move({ n, verb, detail }: { n: string; verb: string; detail: string }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
      <span className="mono text-[11px] text-ink-3 tabular-nums tracking-[0.16em]">{n}</span>
      <div>
        <div className="display text-[22px] leading-none text-ink">{verb}.</div>
        <div className="mt-1 text-[13.5px] leading-[1.6] text-ink-2 max-w-[40ch]">{detail}</div>
      </div>
    </li>
  );
}
function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="display text-[20px] leading-[1.2] text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-2 max-w-[36ch]">{body}</p>
    </div>
  );
}
function Persona({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="border-t-2 border-ink pt-3">
      <div className="display text-[18px] leading-tight text-ink">{title}</div>
      <p className="mt-2 max-w-[36ch]">{children}</p>
    </li>
  );
}
function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 md:gap-10 py-5">
      <dt className="display text-[17px] text-ink leading-tight">{q}</dt>
      <dd className="text-[14px] leading-[1.7] text-ink-2 max-w-[62ch]">{children}</dd>
    </div>
  );
}
