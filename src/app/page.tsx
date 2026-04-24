/**
 * Cadence landing — bold sales-energy (grammar inspired by Gong's landing).
 *
 * Warm gradient hero behind an outsized bold claim. A tilted product-demo
 * frame floating with a drop-shadow. A row of mock company logos in warm
 * tones. Confident sales-tech voice, coral accents.
 */
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { CALLS } from "@/lib/calls";

export default function Landing() {
  const call = CALLS[0];
  const crit = call.coaching.find((t) => t.severity === "critical") ?? call.coaching[0];
  const warn = call.coaching.find((t) => t.severity === "warn") ?? call.coaching[1];
  const good = call.coaching.find((t) => t.severity === "ok")   ?? call.coaching[2];
  const moments = [crit, warn, good].filter(Boolean).slice(0, 3);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <MarketingNav />

      {/* Hero on gradient */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(70% 60% at 20% 0%, var(--accent-soft, #ffe1d7), transparent 60%), radial-gradient(60% 50% at 90% 20%, rgba(244,194,178,0.55), transparent 60%), var(--paper)",
          }}
        />
        <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-20 pb-10 md:pt-28">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-center">
            <div>
              <div className="label" style={{ color: "var(--accent, #d35a3c)" }}>
                Revenue call intelligence
              </div>
              <h1 className="display mt-5 text-[64px] leading-[0.94] tracking-[-0.02em] text-ink md:text-[104px]">
                Every call,{" "}
                <span className="display-italic" style={{ color: "var(--accent)" }}>
                  coached.
                </span>
              </h1>
              <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] text-ink-2">
                Upload the recording. Get moment-level coaching with the transcript attached and the talk-ratio graphed. Before the next dial.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/app/new"
                  className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-[14px] rounded-md hover:bg-ink-2 transition-colors"
                >
                  Upload a call
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 border border-line bg-card px-5 py-3 text-[14px] text-ink-2 rounded-md hover:border-line-2 hover:text-ink transition-colors"
                >
                  See a sample call
                </Link>
              </div>

              <div className="mt-10 flex items-baseline gap-6 text-[11.5px] text-ink-3">
                <span className="mono">47 calls / week / rep</span>
                <span aria-hidden>·</span>
                <span className="mono">3m 12s · mean call length</span>
                <span aria-hidden>·</span>
                <span className="mono">12 coaching tags / call</span>
              </div>
            </div>

            {/* Tilted product frame */}
            <div className="relative">
              <div
                className="rounded-xl border border-line bg-card p-4 mx-auto max-w-[420px]"
                style={{
                  transform: "rotate(2deg)",
                  boxShadow:
                    "0 30px 80px -20px rgba(211,90,60,0.35), 0 15px 40px -20px rgba(0,0,0,0.15)",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="mono text-[10px] text-ink-3 tracking-[0.14em] uppercase">
                    {call.company} · {call.stage}
                  </span>
                  <span
                    className="mono text-[10px] font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {call.score}/100
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center font-semibold text-[13px]"
                    style={{ background: "var(--accent)", color: "var(--paper)" }}
                  >
                    {call.rep.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] text-ink font-medium">{call.rep.name}</div>
                    <div className="text-[11px] text-ink-3">{call.rep.role}</div>
                  </div>
                  <span className="mono text-[10.5px] text-ink-3">
                    {Math.round(call.durationSec / 60)}m
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-line">
                  <ol className="space-y-2">
                    {moments.map((m) => {
                      if (!m) return null;
                      const mins = Math.floor(m.atSec / 60);
                      const secs = m.atSec % 60;
                      const ts = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
                      const tone =
                        m.severity === "critical" ? "#c13f45" :
                        m.severity === "warn"     ? "#d39a3a" :
                                                    "#3a7b55";
                      return (
                        <li key={m.id} className="grid grid-cols-[auto_1fr] gap-3 items-baseline text-[12px]">
                          <span className="mono tabular-nums text-ink" style={{ color: tone }}>
                            {ts}
                          </span>
                          <div>
                            <div className="text-ink leading-tight">{m.title}</div>
                            <div className="text-[11px] text-ink-3 italic line-clamp-1">{m.note}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Talk-ratio strip */}
      <section className="mx-auto max-w-[1240px] px-6 md:px-10 py-16">
        <div className="text-center mb-10">
          <div className="label">Talk ratio · this call</div>
          <h2 className="display mt-3 text-[32px] leading-[1.15] tracking-[-0.012em] text-ink md:text-[44px]">
            The rep spoke <span style={{ color: "var(--accent)" }}>{call.talkRatio.rep}%</span> of the time. The prospect <span style={{ color: "var(--accent)" }}>{call.talkRatio.prospect}%</span>.
          </h2>
        </div>

        <div className="relative h-[14px] rounded-full overflow-hidden border border-line bg-card mx-auto max-w-[900px]">
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${call.talkRatio.rep}%`, background: "var(--accent)" }}
          />
          <div
            className="absolute inset-y-0 right-0"
            style={{ width: `${call.talkRatio.prospect}%`, background: "var(--ink)" }}
          />
        </div>
        <div className="mt-3 mx-auto max-w-[900px] flex items-baseline justify-between text-[11.5px] text-ink-3 mono">
          <span>rep</span>
          <span>ideal 40%</span>
          <span>prospect</span>
        </div>

        <div className="mt-16 flex items-center justify-center">
          <Link
            href="/app/new"
            className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-[14px] rounded-md hover:bg-ink-2 transition-colors"
          >
            Upload a call
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
