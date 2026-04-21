import Link from "next/link";
import { CoachingTimeline } from "@/components/coaching-timeline";
import { HeroTimeline } from "@/components/hero-timeline";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { CALLS } from "@/lib/calls";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      {/* ────────── HERO ────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-6 pt-14 pb-10 md:px-8 md:pt-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-12">
            <div>
              <div className="label mb-4">REVENUE CALL INTELLIGENCE · BETA</div>
              <h1 className="display text-[56px] leading-[0.95] tracking-[-0.022em] text-ink md:text-[96px]">
                Upload a call.
                <br />
                <span className="display-italic">Get the coaching</span>
                <br />
                <span className="display">you actually need.</span>
              </h1>

              <p className="mt-6 max-w-[54ch] text-[15.5px] leading-[1.7] text-ink-2">
                Cadence listens to a sales call, scores the talk-track,
                detects objections and commitments, and hands back
                timestamped coaching. Built for individual reps — no IT
                ticket, no seat-minimum, no $30K enterprise contract.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/app/new"
                  className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors"
                >
                  <span>Upload a call</span>
                  <span aria-hidden>↗</span>
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 border border-line bg-card px-5 py-3 text-[14px] text-ink-2 rounded-[3px] hover:border-line-2 hover:text-ink transition-colors"
                >
                  See a sample call
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-3 text-[11.5px] text-ink-3">
                <Stat value="47s" unit="avg coaching" label="From upload to first insight" />
                <Stat value="$19" unit="/mo" label="Self-serve tier; no seat minimum" />
                <Stat value="100%" unit="timestamped" label="Every tag links to audio" />
              </div>
            </div>

            {/* Right column: a quote + real product preview */}
            <div>
              <figure className="relative ml-auto max-w-[460px]">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Priya Patel — AE, Velocity Labs"
                  className="block w-full aspect-[5/4] object-cover filter grayscale-[0.15] contrast-[1.02]"
                  loading="lazy"
                />
                <div className="absolute left-0 bottom-0 translate-y-[12px] max-w-[88%] bg-paper border-l-[3px] border-[color:var(--accent)] px-4 py-3">
                  <blockquote className="display-italic text-[18px] leading-[1.35] text-ink md:text-[19px]">
                    &ldquo;My first coaching tag was &lsquo;you talked 72% of
                    the call.&rsquo; I closed three deals the next month.&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 flex items-baseline gap-2 text-[11px] text-ink-3">
                    <span className="mono uppercase tracking-[0.1em] text-ink">Priya P.</span>
                    <span aria-hidden className="text-ink-4">·</span>
                    <span>AE · Velocity Labs</span>
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>

          {/* ─── THE ANIMATED HERO DIAGRAM ─── */}
          <div className="mt-16 md:mt-20">
            <HeroTimeline />
          </div>
        </div>
      </section>

      {/* ────────── METHOD LEDE ────────── */}
      <section className="mx-auto max-w-[1240px] px-6 md:px-8 pt-20 pb-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <div className="label">The method</div>
            <h2 className="display mt-3 text-[36px] leading-[1.05] tracking-[-0.018em] text-ink md:text-[52px]">
              Every tag is a{" "}
              <span className="display-italic">moment.</span>
            </h2>
          </div>
          <div className="text-[14.5px] leading-[1.75] text-ink-2 max-w-[60ch] md:text-[15.5px]">
            Coaching tags are not vibes. Each one points at a specific second
            in the call audio; you can click the tag and Cadence plays the
            five seconds before and after. You can send that clip to your
            manager. You can send it to yourself at 7am before the next one.
            The feedback is only useful if you can hear it.
          </div>
        </div>
      </section>

      {/* ────────── INLINE PRODUCT COMPONENT ────────── */}
      <section className="mx-auto max-w-[1240px] px-6 md:px-8 pt-12 pb-8">
        <div className="mb-5 flex items-baseline justify-between">
          <div className="label">SPECIMEN · COACHING TIMELINE</div>
          <div className="label !tracking-[0.16em]">
            RENDERED FROM <span className="mono text-ink-2">/app</span> · NOT A SCREENSHOT
          </div>
        </div>
        <CoachingTimeline calls={CALLS} />
        <p className="mt-5 text-[12.5px] leading-[1.65] text-ink-3 max-w-[60ch]">
          This is the same component that runs in the app — tabs between live
          calls, click <span className="mono text-ink-2">play preview</span>{" "}
          to sweep the play-head, hover the coaching dots on the timeline for
          a summary.
        </p>
      </section>

      {/* ────────── COMPARISON TO INCUMBENTS ────────── */}
      <section className="mx-auto max-w-[1240px] px-6 md:px-8 pt-20 pb-4">
        <div className="max-w-[860px]">
          <div className="label">Not another Gong.</div>
          <h2 className="display mt-3 text-[36px] leading-[1.08] tracking-[-0.018em] text-ink md:text-[48px]">
            The <span className="display-italic">individual</span> AE has been forgotten.
          </h2>
          <p className="mt-4 max-w-[62ch] text-[14.5px] leading-[1.75] text-ink-2">
            Enterprise conversation-intelligence tools are sold to the CRO.
            Cadence is sold to the rep. No seat minimum. No IT ticket. No
            $30K annual contract. If you have a call and a browser, you have
            Cadence.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Pillar
              num="01"
              title="Your call, your data."
              body="You upload the recording; Cadence processes and returns. No Zoom-scraping sidecar. No company-wide rollout."
            />
            <Pillar
              num="02"
              title="Timestamped only."
              body="Every coaching tag points at a specific second. No vague 'improve your discovery' nonsense."
            />
            <Pillar
              num="03"
              title="Priced like software."
              body="$19/month for ten calls. The annual price is less than Gong's setup fee."
            />
          </div>
        </div>
      </section>

      {/* ────────── CLOSING ────────── */}
      <section className="mx-auto max-w-[1240px] px-6 md:px-8 pt-24 pb-4">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="label">One call · Forty-seven seconds</div>
          <h2 className="display mt-4 text-[42px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[64px]">
            Your next deal{" "}
            <span className="display-italic">starts after this call.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-ink-2">
            Upload a recording. Get timestamped coaching. Make the next call
            the one you would have wanted the manager to hear.
          </p>
          <div className="mt-8 inline-flex items-center gap-3">
            <Link
              href="/app/new"
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-[14px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors"
            >
              <span>Upload a call</span>
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="min-w-0">
      <div className="display text-[32px] leading-none tabular-nums text-ink">
        {value}
        <span className="mono text-[11.5px] text-ink-3 ml-1 font-normal tabular-nums">
          {unit}
        </span>
      </div>
      <div className="mt-1 text-[11.5px] text-ink-3 max-w-[24ch]">{label}</div>
    </div>
  );
}

function Pillar({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="mono text-[10.5px] text-ink-3 tabular-nums tracking-[0.18em]">
        {num}
      </div>
      <h3 className="display mt-2 text-[20px] leading-[1.2] tracking-[-0.008em] text-ink md:text-[22px]">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-2 max-w-[36ch]">
        {body}
      </p>
    </div>
  );
}
