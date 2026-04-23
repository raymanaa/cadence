import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { CALLS } from "@/lib/calls";

export default function Landing() {
  const call = CALLS[0];
  const tag =
    call.coaching.find((t) => t.severity === "critical") ?? call.coaching[0];
  const mins = Math.floor(tag.atSec / 60);
  const secs = tag.atSec % 60;
  const timestamp = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const tone =
    tag.severity === "critical"
      ? "var(--crit, var(--accent))"
      : tag.severity === "warn"
        ? "var(--warn, var(--accent))"
        : "var(--ok, var(--accent))";

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section className="flex-1">
        <div className="mx-auto max-w-[1080px] px-6 md:px-10 pt-24 pb-20 md:pt-32">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16">
            <div>
              <div className="label">Revenue-call intelligence</div>
              <h1 className="display mt-5 text-[64px] leading-[0.96] tracking-[-0.018em] md:text-[96px]">
                Coach every rep.{" "}
                <span className="display-italic" style={{ color: "var(--accent)" }}>
                  On every call.
                </span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-ink-2">
                Upload the call. Cadence returns timestamped coaching — with evidence, not vibes.
              </p>
              <div className="mt-8">
                <Link
                  href="/app/new"
                  className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[3px] hover:bg-ink-2 transition-colors"
                >
                  Upload a call
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="border border-line bg-card rounded-[4px] p-5">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[10px] text-ink-3 tracking-[0.12em]">
                  {call.company} · {call.stage}
                </span>
                <span
                  className="mono text-[10px] font-semibold tracking-[0.14em]"
                  style={{ color: tone }}
                >
                  {tag.severity.toUpperCase()}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="mono text-[22px] tabular-nums text-ink leading-none">
                  {timestamp}
                </span>
                <div className="display text-[19px] text-ink leading-tight">
                  {tag.title}
                </div>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-[1.6] text-ink-2 italic">
                {tag.note}
              </p>
            </div>
          </div>
        </div>

        <div className="border-y border-line">
          <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Step n="01" verb="Upload" detail="Any call recording" />
            <Step n="02" verb="Score" detail="Moment by moment" />
            <Step n="03" verb="Coach" detail="Timestamped, with transcript" />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Step({ n, verb, detail }: { n: string; verb: string; detail: string }) {
  return (
    <div>
      <div className="mono text-[10.5px] text-ink-3 tracking-[0.16em]">{n}</div>
      <div className="display mt-1 text-[26px] leading-none text-ink">{verb}.</div>
      <div className="mt-1 text-[13px] text-ink-2">{detail}</div>
    </div>
  );
}
