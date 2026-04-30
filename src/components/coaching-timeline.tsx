"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type Call,
  fmtTime,
  severityConfig,
  stageConfig,
} from "@/lib/calls";

/**
 * CoachingTimeline — the real-product inline component (landing rule 2).
 * Renders a mini-timeline per call with talk-track bars, markers, and
 * clickable coaching tags. Same component the app's call-reader uses
 * for the hero summary.
 */
export function CoachingTimeline({
  calls,
  initialCallId,
}: {
  calls: Call[];
  initialCallId?: string;
}) {
  const [activeId, setActiveId] = useState<string>(initialCallId ?? calls[0].id);
  const active = calls.find((c) => c.id === activeId) ?? calls[0];

  return (
    <div className="border border-line bg-card">
      {/* Tabs */}
      <div className="flex items-baseline gap-1 border-b border-line overflow-x-auto">
        {calls.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={[
                "shrink-0 px-5 py-3.5 text-left transition-colors",
                isActive
                  ? "bg-paper-2/50"
                  : "hover:bg-paper-2/30",
              ].join(" ")}
              style={
                isActive
                  ? { boxShadow: "inset 0 -2px 0 0 var(--accent)" }
                  : undefined
              }
            >
              <div className="flex items-baseline gap-2">
                <span className="display text-[15px] leading-tight text-ink">
                  {c.company}
                </span>
                <span className="mono text-[10px] text-ink-3 tabular-nums">
                  {c.id.replace("call-", "#")}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-2 text-[10.5px] text-ink-3">
                <span className="mono">{fmtTime(c.durationSec)}</span>
                <span aria-hidden className="text-ink-4">·</span>
                <span>{c.dealValue}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active call */}
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-5 md:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <img
              src={active.rep.avatar}
              alt={active.rep.name}
              className="h-11 w-11 rounded-full object-cover border border-line filter grayscale-[0.15]"
              loading="lazy"
            />
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.1em] text-ink">
                {active.rep.name}
              </div>
              <div className="text-[11px] text-ink-3">
                called <span className="text-ink-2">{active.prospect.name}</span>, {active.prospect.role} at {active.prospect.company}
              </div>
              <div className="mt-1 flex items-baseline gap-2 text-[10.5px] text-ink-3">
                <span
                  className="label !text-[9.5px] !tracking-[0.16em]"
                  style={{ color: stageConfig(active.stage).ink }}
                >
                  {stageConfig(active.stage).label}
                </span>
                <span aria-hidden className="text-ink-4">·</span>
                <span className="mono tabular-nums">{active.dealValue}</span>
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-4">
            <ScoreMeter score={active.score} />
            <div className="text-right">
              <div className="label !text-[9.5px]">Talk ratio</div>
              <div className="mt-1 text-[13px] text-ink">
                <span className="mono tabular-nums">{active.talkRatio.rep}%</span>
                <span className="text-ink-3"> / </span>
                <span className="mono tabular-nums">{active.talkRatio.prospect}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini-timeline */}
        <div className="mt-6">
          <Timeline call={active} />
        </div>

        {/* Summary + tags */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_1fr] md:gap-8">
          <div>
            <div className="label">Summary</div>
            <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-2">
              {active.summary}
            </p>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <div className="label">Coaching · {active.coaching.length}</div>
              <Link
                href={`/app/${active.slug}/`}
                className="text-[11px] text-ink-3 hover:text-[color:var(--accent)] transition-colors"
              >
                open in app ↗
              </Link>
            </div>
            <ul className="mt-2 flex flex-col gap-2">
              {active.coaching.map((t) => {
                const cfg = severityConfig(t.severity);
                return (
                  <li
                    key={t.id}
                    className="flex items-start gap-2.5 border-l-2 pl-3 py-1"
                    style={{ borderColor: cfg.color }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px] text-ink leading-tight">
                          {t.title}
                        </span>
                        <span className="mono text-[10px] text-ink-3 tabular-nums">
                          {fmtTime(t.atSec)}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-ink-3 leading-[1.55] mt-0.5">
                        {t.note}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Timeline({ call }: { call: Call }) {
  const [play, setPlay] = useState(false);
  const progress = useMotionValue(0);
  const playheadLeft = useTransform(progress, (p) => `${p}%`);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!play) {
      controlsRef.current?.stop();
      return;
    }
    const controls = animate(progress, 100, {
      duration: 6,
      ease: "linear",
      onComplete: () => setPlay(false),
    });
    controlsRef.current = controls;
    return () => controls.stop();
  }, [play, progress]);

  useEffect(() => {
    if (!play) progress.set(0);
  }, [play, progress]);

  const dur = call.durationSec;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => setPlay((p) => !p)}
          className="inline-flex items-center gap-1.5 border border-line bg-paper-2/50 px-2.5 py-1 text-[11px] text-ink-2 hover:border-line-2 hover:text-ink transition-colors rounded-sm"
        >
          {play ? <span aria-hidden>⏸</span> : <span aria-hidden>▶</span>}
          <span>{play ? "pause" : "play preview"}</span>
        </button>
        <div className="flex items-baseline gap-3 text-[10.5px] text-ink-3">
          <Legend color="var(--lane-rep)" label="rep" />
          <Legend color="var(--lane-prospect)" label="prospect" />
          <Legend color="var(--signal-amber)" label="objection" />
          <Legend color="var(--signal-green)" label="commit" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-sm border border-line bg-paper-2/40">
        {/* Lanes */}
        <div className="relative h-[20px]">
          {call.segments
            .filter((s) => s.speaker === "rep")
            .map((s, i) => (
              <span
                key={`r-${i}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(s.startSec / dur) * 100}%`,
                  width: `${((s.endSec - s.startSec) / dur) * 100}%`,
                  background: "var(--lane-rep)",
                }}
              />
            ))}
        </div>
        <div className="relative h-[20px] border-t border-line/60">
          {call.segments
            .filter((s) => s.speaker === "prospect")
            .map((s, i) => (
              <span
                key={`p-${i}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(s.startSec / dur) * 100}%`,
                  width: `${((s.endSec - s.startSec) / dur) * 100}%`,
                  background: "var(--lane-prospect)",
                }}
              />
            ))}
        </div>

        {/* Marker pins */}
        {call.markers.map((m, i) => {
          const tone =
            m.kind === "objection"
              ? "var(--signal-amber)"
              : m.kind === "commitment"
                ? "var(--signal-green)"
                : "var(--ink-3)";
          return (
            <span
              key={i}
              className="absolute top-[6px] bottom-[6px]"
              style={{
                left: `${(m.atSec / dur) * 100}%`,
                width: 2,
                background: tone,
                boxShadow: `0 0 0 2px ${tone}33`,
              }}
              title={`${m.label} @ ${fmtTime(m.atSec)}`}
            />
          );
        })}

        {/* Coaching dots above */}
        {call.coaching.map((c) => {
          const cfg = severityConfig(c.severity);
          return (
            <span
              key={c.id}
              className="absolute top-[-5px] h-[10px] w-[10px] rounded-full"
              style={{
                left: `${(c.atSec / dur) * 100}%`,
                transform: "translateX(-50%)",
                background: cfg.color,
                boxShadow: `0 0 0 2px var(--card)`,
              }}
              title={c.title}
            />
          );
        })}

        {/* Play-head */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 w-[2px]"
          style={{
            left: playheadLeft,
            background: "var(--accent)",
            boxShadow: "0 0 8px rgba(232,92,61,0.5)",
          }}
        />
      </div>

      <div className="flex items-baseline justify-between mt-1.5 px-0.5">
        <span className="mono text-[10px] text-ink-3 tabular-nums">00:00</span>
        <span className="mono text-[10px] text-ink-3 tabular-nums">
          {fmtTime(Math.floor(dur / 2))}
        </span>
        <span className="mono text-[10px] text-ink-3 tabular-nums">
          {fmtTime(dur)}
        </span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
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

function ScoreMeter({ score }: { score: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * c;
  const color =
    score >= 80
      ? "var(--signal-green)"
      : score >= 60
        ? "var(--signal-amber)"
        : "var(--accent-2)";
  return (
    <div className="relative inline-flex items-center gap-2">
      <svg width="42" height="42" viewBox="0 0 42 42">
        <circle
          cx="21"
          cy="21"
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
        <circle
          cx="21"
          cy="21"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 21 21)"
        />
      </svg>
      <div className="flex flex-col">
        <span className="mono text-[16px] font-semibold text-ink tabular-nums leading-none">
          {score}
        </span>
        <span className="label !text-[9px] mt-1">score</span>
      </div>
    </div>
  );
}
