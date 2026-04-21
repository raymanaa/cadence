"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Pause, Play, Share2, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Call,
  type CoachingTag,
  fmtTime,
  severityConfig,
  stageConfig,
} from "@/lib/calls";

/**
 * CallReader — the main app surface. Horizontal waveform + transcript
 * + coaching rail. The play-head is a motion value that transcript and
 * waveform both read from, so playing seeks the transcript.
 */
export function CallReader({ call }: { call: Call }) {
  const [playing, setPlaying] = useState(false);
  const [activeTag, setActiveTag] = useState<CoachingTag | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const playhead = useMotionValue(0); // seconds
  const pct = useTransform(playhead, (s) => (s / call.durationSec) * 100);
  const pctStr = useTransform(pct, (p) => `${p}%`);

  // Animate the play-head while playing
  useEffect(() => {
    if (!playing) return;
    const start = playhead.get();
    const remaining = call.durationSec - start;
    if (remaining <= 0) {
      playhead.set(0);
      return;
    }
    const controls = animate(playhead, call.durationSec, {
      duration: remaining / 8, // 8x real-time preview
      ease: "linear",
      onComplete: () => setPlaying(false),
    });
    return () => controls.stop();
  }, [playing, playhead, call.durationSec]);

  const sCfg = stageConfig(call.stage);

  function seek(sec: number) {
    playhead.set(Math.max(0, Math.min(call.durationSec, sec)));
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-6 md:px-8">
      {/* Breadcrumb bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="label !text-[10px] text-ink-3 hover:text-ink">
            All calls
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-1.5 border border-line bg-card px-3 py-1.5 text-[11.5px] text-ink-2 hover:border-line-2 hover:text-ink transition-colors rounded-sm"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Share clip</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="pt-8 pb-6">
        <div className="flex flex-wrap items-baseline gap-4">
          <span
            className="label !text-[9.5px] !tracking-[0.18em]"
            style={{ color: sCfg.ink }}
          >
            {sCfg.label}
          </span>
          <span className="mono text-[10.5px] text-ink-3 uppercase tracking-[0.12em]">
            {call.id}
          </span>
          <span className="mono text-[10.5px] text-ink-3 tabular-nums">
            {dateLong(call.date)}
          </span>
        </div>

        <h1 className="display mt-3 text-[44px] leading-[0.98] tracking-[-0.02em] text-ink md:text-[64px]">
          {call.company}
        </h1>
        <p className="display-italic mt-2 text-[18px] leading-[1.4] text-ink-2 md:text-[22px]">
          {call.rep.name} × {call.prospect.name} ·{" "}
          <span className="not-italic mono text-[16px] text-ink-3 tabular-nums">
            {call.dealValue}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        <div className="min-w-0">
          {/* Waveform stage */}
          <div className="border border-line bg-card">
            <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
              <span className="label">Call timeline</span>
              <span className="mono text-[10.5px] text-ink-3 tabular-nums">
                <Playtime value={playhead} total={call.durationSec} />
              </span>
            </div>

            <div className="px-5 pt-5 pb-4 md:px-7 md:pt-7">
              {/* Lane labels + lanes */}
              <div className="grid grid-cols-[72px_1fr] gap-4">
                <div className="flex flex-col gap-[26px] pt-2">
                  <LaneLabel name={call.rep.name} role="rep" color="var(--lane-rep)" avatar={call.rep.avatar} />
                  <LaneLabel
                    name={call.prospect.name}
                    role="prospect"
                    color="var(--lane-prospect)"
                  />
                </div>

                <div className="relative">
                  {/* Rep lane */}
                  <Waveform
                    segments={call.segments.filter((s) => s.speaker === "rep")}
                    durationSec={call.durationSec}
                    color="var(--lane-rep)"
                  />
                  <div className="h-2" />
                  <Waveform
                    segments={call.segments.filter((s) => s.speaker === "prospect")}
                    durationSec={call.durationSec}
                    color="var(--lane-prospect)"
                  />

                  {/* Coaching dots on top */}
                  <div
                    aria-hidden
                    className="absolute left-0 right-0"
                    style={{ top: -8 }}
                  >
                    {call.coaching.map((c) => {
                      const cfg = severityConfig(c.severity);
                      const isActive = activeTag?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveTag(c);
                            seek(c.atSec);
                          }}
                          onMouseEnter={() => setActiveTag(c)}
                          className="absolute h-[14px] w-[14px] rounded-full border-[1.5px]"
                          style={{
                            left: `${(c.atSec / call.durationSec) * 100}%`,
                            transform: "translateX(-50%)",
                            background: isActive ? cfg.color : "var(--card)",
                            borderColor: cfg.color,
                          }}
                          title={c.title}
                        />
                      );
                    })}
                  </div>

                  {/* Play-head */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute top-[-10px] bottom-[-12px] w-[2px]"
                    style={{
                      left: pctStr,
                      background: "var(--accent)",
                      boxShadow: "0 0 10px rgba(232,92,61,0.55)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute -top-1 -left-[3px] h-2 w-2 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  </motion.span>

                  {/* Timestamp ruler */}
                  <div className="relative flex items-baseline justify-between border-t border-line pt-1.5 mt-2">
                    {timestamps(call.durationSec).map((t) => (
                      <span
                        key={t}
                        className="mono text-[9.5px] text-ink-3 tabular-nums"
                      >
                        {fmtTime(t)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Transport + markers legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <Transport
                  icon={SkipBack}
                  onClick={() => seek(playhead.get() - 30)}
                  label="-30s"
                />
                <Transport
                  icon={playing ? Pause : Play}
                  primary
                  onClick={() => setPlaying((p) => !p)}
                  label={playing ? "pause" : "play"}
                />
                <Transport
                  icon={SkipForward}
                  onClick={() => seek(playhead.get() + 30)}
                  label="+30s"
                />
              </div>
              <div className="flex items-baseline gap-3 text-[10.5px] text-ink-3">
                <LegendDot color="var(--lane-rep)" label="rep" />
                <LegendDot color="var(--lane-prospect)" label="prospect" />
                <LegendDot color="var(--signal-amber)" label="objection" />
                <LegendDot color="var(--signal-green)" label="commit" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <section className="mt-8">
            <div className="label">Summary</div>
            <p className="display-italic mt-3 text-[20px] leading-[1.5] text-ink max-w-[68ch] md:text-[22px]">
              {call.summary}
            </p>
          </section>

          {/* Transcript */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <div className="label">Transcript</div>
              <span className="mono text-[10.5px] text-ink-3">
                click a line to seek →
              </span>
            </div>
            <ol className="mt-3 divide-y divide-line">
              {call.transcript.map((line, i) => (
                <TranscriptRow
                  key={i}
                  line={line}
                  onSeek={seek}
                  playhead={playhead}
                  tags={call.coaching}
                />
              ))}
            </ol>
          </section>

          {/* Markers timeline */}
          <section className="mt-10">
            <div className="label">Moments</div>
            <ol className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              {call.markers.map((m, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border border-line bg-card px-3.5 py-2.5 hover:bg-paper-2/40 transition-colors"
                >
                  <span
                    className="h-[7px] w-[7px] rounded-full shrink-0"
                    style={{
                      background:
                        m.kind === "objection"
                          ? "var(--signal-amber)"
                          : m.kind === "commitment"
                            ? "var(--signal-green)"
                            : "var(--ink-3)",
                    }}
                    aria-hidden
                  />
                  <button
                    onClick={() => seek(m.atSec)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="label !text-[9.5px]">{m.label}</span>
                      <span className="mono text-[10.5px] tabular-nums text-ink-3">
                        {fmtTime(m.atSec)}
                      </span>
                    </div>
                    {m.note && (
                      <div className="text-[12.5px] text-ink-2 mt-0.5">
                        {m.note}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Coaching rail */}
        <aside className="min-w-0">
          <div className="lg:sticky lg:top-20">
            <div className="label">Coaching · {call.coaching.length}</div>
            <ul className="mt-3 flex flex-col gap-3">
              {call.coaching.map((t) => (
                <CoachingCard
                  key={t.id}
                  tag={t}
                  isActive={activeTag?.id === t.id}
                  onOpen={() => {
                    setActiveTag(t);
                    seek(t.atSec);
                  }}
                />
              ))}
            </ul>

            <div className="mt-6 border border-dashed border-line-2 px-4 py-4">
              <div className="label">Next call</div>
              <p className="mt-2 text-[12.5px] leading-[1.65] text-ink-2">
                Practice talk-track balance with a timer. Target &lt;55% rep
                on next discovery.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {shareOpen && (
          <ShareDialog
            call={call}
            activeTag={activeTag ?? call.coaching[0]}
            onClose={() => setShareOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Waveform({
  segments,
  durationSec,
  color,
}: {
  segments: { startSec: number; endSec: number }[];
  durationSec: number;
  color: string;
}) {
  // Render 80 equal "bars" across the track; bar is solid if it falls
  // inside a segment, transparent otherwise. Heights vary pseudo-randomly
  // from a seeded sine to give the waveform texture without a real signal.
  const bars = 100;
  return (
    <div className="relative h-[38px] overflow-hidden border border-line rounded-[3px] bg-paper-2/40 flex items-end gap-[1px] px-[2px]">
      {Array.from({ length: bars }, (_, i) => {
        const t = (i / bars) * durationSec;
        const inSeg = segments.some((s) => t >= s.startSec && t < s.endSec);
        const h = 30 + Math.abs(Math.sin(i * 0.77) * 18) + Math.abs(Math.cos(i * 0.43) * 10);
        return (
          <span
            key={i}
            className="flex-1"
            style={{
              height: `${Math.min(100, h)}%`,
              background: inSeg ? color : "transparent",
              opacity: inSeg ? 0.88 : 0,
              minWidth: 1,
            }}
          />
        );
      })}
    </div>
  );
}

function timestamps(duration: number): number[] {
  const n = 6;
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(Math.floor((i / (n - 1)) * duration));
  return out;
}

function Playtime({ value, total }: { value: import("framer-motion").MotionValue<number>; total: number }) {
  const [s, setS] = useState(0);
  useEffect(() => value.on("change", (v) => setS(Math.floor(v))), [value]);
  return (
    <>
      {fmtTime(s)} <span className="text-ink-4">/ {fmtTime(total)}</span>
    </>
  );
}

function LaneLabel({
  name,
  role,
  color,
  avatar,
}: {
  name: string;
  role: "rep" | "prospect";
  color: string;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-7 w-7 rounded-full object-cover border border-line filter grayscale-[0.15]"
          loading="lazy"
        />
      ) : (
        <span
          aria-hidden
          className="h-7 w-7 rounded-full border flex items-center justify-center"
          style={{ borderColor: color, background: "var(--paper-2)", color }}
        >
          <span className="mono text-[10px] font-semibold">
            {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </span>
        </span>
      )}
      <div className="hidden md:block">
        <div className="mono text-[10.5px] uppercase tracking-[0.08em] text-ink">
          {name.split(" ")[0]}
        </div>
        <div className="label !text-[9px] !tracking-[0.18em]">{role}</div>
      </div>
    </div>
  );
}

function Transport({
  icon: Icon,
  onClick,
  label,
  primary,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={[
        "inline-flex items-center justify-center gap-1.5 rounded-[3px] transition-colors",
        primary
          ? "bg-ink text-paper px-4 py-2 text-[12.5px] hover:bg-ink-2"
          : "border border-line bg-card text-ink-2 px-3 py-1.5 text-[11.5px] hover:border-line-2 hover:text-ink",
      ].join(" ")}
    >
      <Icon className={primary ? "h-4 w-4" : "h-3.5 w-3.5"} strokeWidth={1.75} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        aria-hidden
        className="h-[7px] w-[7px] rounded-full"
        style={{ background: color }}
      />
      <span>{label}</span>
    </span>
  );
}

function TranscriptRow({
  line,
  onSeek,
  playhead,
  tags,
}: {
  line: Call["transcript"][number];
  onSeek: (s: number) => void;
  playhead: import("framer-motion").MotionValue<number>;
  tags: CoachingTag[];
}) {
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    return playhead.on("change", (v) => {
      setIsCurrent(v >= line.atSec && v < line.atSec + 25);
    });
  }, [playhead, line.atSec]);

  const tag = useMemo(
    () => (line.tag ? tags.find((t) => t.id === line.tag) : undefined),
    [line.tag, tags],
  );
  const tagCfg = tag ? severityConfig(tag.severity) : undefined;

  return (
    <li
      className={[
        "grid grid-cols-[56px_76px_1fr] items-start gap-3 py-3 cursor-pointer transition-colors",
        isCurrent ? "bg-accent-soft/40" : "hover:bg-paper-2/40",
      ].join(" ")}
      onClick={() => onSeek(line.atSec)}
    >
      <span className="mono text-[10.5px] text-ink-3 tabular-nums pt-0.5">
        {fmtTime(line.atSec)}
      </span>
      <span
        className="mono text-[10.5px] uppercase tracking-[0.08em] pt-0.5"
        style={{
          color: line.speaker === "rep" ? "var(--lane-rep)" : "var(--lane-prospect)",
        }}
      >
        {line.speaker}
      </span>
      <div>
        <p className="text-[14px] leading-[1.65] text-ink">{line.text}</p>
        {tag && tagCfg && (
          <div
            className="mt-1.5 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10.5px]"
            style={{
              color: tagCfg.color,
              borderColor: tagCfg.color,
              background: tagCfg.bg,
            }}
          >
            <span
              aria-hidden
              className="h-[4px] w-[4px] rounded-full"
              style={{ background: tagCfg.color }}
            />
            {tag.title}
          </div>
        )}
      </div>
    </li>
  );
}

function CoachingCard({
  tag,
  isActive,
  onOpen,
}: {
  tag: CoachingTag;
  isActive: boolean;
  onOpen: () => void;
}) {
  const cfg = severityConfig(tag.severity);
  return (
    <li>
      <button
        onClick={onOpen}
        className={[
          "w-full text-left border transition-colors px-4 py-3",
          isActive
            ? "border-ink bg-card"
            : "border-line bg-card hover:border-line-2",
        ].join(" ")}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span
            className="label !text-[9.5px] !tracking-[0.18em]"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span className="mono text-[10.5px] text-ink-3 tabular-nums">
            {fmtTime(tag.atSec)}
          </span>
        </div>
        <div className="mt-1.5 display text-[16px] leading-[1.25] text-ink">
          {tag.title}
        </div>
        <p className="mt-1.5 text-[12px] leading-[1.6] text-ink-2">
          {tag.note}
        </p>
      </button>
    </li>
  );
}

function ShareDialog({
  call,
  activeTag,
  onClose,
}: {
  call: Call;
  activeTag: CoachingTag;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/clip/${call.slug}/${activeTag.id}/`
      : `/clip/${call.slug}/${activeTag.id}/`;

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-6 w-full max-w-[520px] border border-line bg-card"
      >
        <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
          <span className="label">Share coaching clip</span>
          <button
            onClick={onClose}
            className="mono text-[11px] text-ink-3 hover:text-ink"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-5">
          <p className="text-[13px] text-ink-2">
            A 10-second clip centered on{" "}
            <strong className="text-ink">{activeTag.title}</strong> at{" "}
            <span className="mono tabular-nums">{fmtTime(activeTag.atSec)}</span>.
            Anyone with this link can play it back with the coaching note.
          </p>
          <div className="mt-4 flex items-center gap-2 border border-line bg-paper-2 px-3 py-2.5">
            <span className="mono text-[11.5px] text-ink truncate flex-1">
              {url}
            </span>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1400);
                } catch { /* noop */ }
              }}
              className="shrink-0 bg-ink text-paper px-3 py-1 text-[11px] font-medium hover:bg-ink-2 transition-colors rounded-sm"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-ink-3">
            <span>Signed · never expires</span>
            <span className="mono">
              cadence v1.4 ·{" "}
              <span className="text-[color:var(--accent)]">{call.slug.replace("call-", "")}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function dateLong(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}
