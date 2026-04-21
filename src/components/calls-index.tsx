"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type Call, fmtTime, severityConfig, stageConfig } from "@/lib/calls";

type StageFilter = "all" | Call["stage"];

const STAGES: { id: StageFilter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "discovery", label: "DISCOVERY" },
  { id: "demo", label: "DEMO" },
  { id: "negotiation", label: "NEGOTIATION" },
  { id: "closing", label: "CLOSING" },
];

export function CallsIndex({ calls }: { calls: Call[] }) {
  const [stage, setStage] = useState<StageFilter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return calls.filter((c) => {
      if (stage !== "all" && c.stage !== stage) return false;
      if (q) {
        const h = `${c.company} ${c.rep.name} ${c.prospect.name} ${c.prospect.company}`.toLowerCase();
        if (!h.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [calls, stage, q]);

  const stats = useMemo(() => {
    const criticalCount = calls.flatMap((c) => c.coaching).filter((t) => t.severity === "critical").length;
    const avgScore = Math.round(
      calls.reduce((a, c) => a + c.score, 0) / Math.max(1, calls.length),
    );
    const avgRepTalk = Math.round(
      calls.reduce((a, c) => a + c.talkRatio.rep, 0) / Math.max(1, calls.length),
    );
    return { criticalCount, avgScore, avgRepTalk };
  }, [calls]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-8 pb-24 md:px-10">
      <div className="flex items-baseline justify-between border-b border-ink pb-3">
        <span className="label">CALL LIBRARY · BETA</span>
        <span className="mono text-[10.5px] text-ink-3 tabular-nums">
          {todayLong()}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1.6fr_1fr] md:items-end">
        <div>
          <h1 className="display text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[68px]">
            Your calls<span className="display-italic">,</span>{" "}
            <span className="display-italic">coached.</span>
          </h1>
          <p className="mt-3 max-w-[56ch] text-[14.5px] leading-[1.7] text-ink-2">
            Every call you&apos;ve uploaded is scored, talk-tracked, and
            tagged. Filter by stage or search by prospect.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <DeckStat label="Avg score" value={`${stats.avgScore}`} tone="ok" />
          <DeckStat label="Avg rep talk" value={`${stats.avgRepTalk}%`} tone="warn" />
          <DeckStat label="Critical tags" value={`${stats.criticalCount}`} tone="critical" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-10 flex flex-wrap items-center gap-4 border-y border-line py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STAGES.map((s) => {
            const active = stage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className={[
                  "label !text-[10px] !tracking-[0.18em] px-3 py-1.5 transition-colors shrink-0",
                  active ? "text-ink" : "text-ink-3 hover:text-ink-2",
                ].join(" ")}
                style={
                  active
                    ? { boxShadow: "inset 0 -2px 0 0 var(--accent)" }
                    : undefined
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 border border-line bg-card px-3 py-1.5 rounded-sm">
          <Search className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search prospect, rep, company"
            className="min-w-[240px] bg-transparent text-[13px] text-ink placeholder:text-ink-3 outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onReset={() => { setStage("all"); setQ(""); }} />
      ) : (
        <ol className="mt-8 space-y-4">
          {filtered.map((c, i) => (
            <CallRow key={c.id} call={c} index={i + 1} />
          ))}
        </ol>
      )}

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
        <span className="mono text-[10.5px] text-ink-3 tracking-[0.16em]">
          CADENCE v1.4 · {filtered.length} OF {calls.length} CALLS SHOWN
        </span>
        <Link
          href="/app/new"
          className="inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-[12.5px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors"
        >
          Upload a call
          <span aria-hidden>↗</span>
        </Link>
      </div>
    </div>
  );
}

function CallRow({ call, index }: { call: Call; index: number }) {
  const stageCfg = stageConfig(call.stage);
  const critical = call.coaching.filter((t) => t.severity === "critical").length;
  const warn = call.coaching.filter((t) => t.severity === "warn").length;

  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        href={`/app/${call.slug}/`}
        className="group block border border-line bg-card hover:border-line-2 transition-colors"
      >
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[72px_1fr_auto]">
          <div className="hidden md:flex flex-col items-center justify-center border-r border-line bg-paper-2/40 py-5">
            <span className="mono text-[11px] tabular-nums text-ink-3">
              0{index}
            </span>
            <div className="mt-1 h-[1px] w-4 bg-line" />
            <span className="mono text-[9.5px] text-ink-3 tabular-nums mt-2">
              {dateShort(call.date)}
            </span>
          </div>

          <div className="px-5 py-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="display text-[22px] leading-tight text-ink">
                {call.company}
              </span>
              <span
                className="label !text-[9.5px] !tracking-[0.16em]"
                style={{ color: stageCfg.ink }}
              >
                {stageCfg.label}
              </span>
              <span className="mono text-[11px] tabular-nums text-ink-3">
                {call.dealValue}
              </span>
              <span aria-hidden className="text-ink-4">·</span>
              <span className="mono text-[11px] tabular-nums text-ink-3">
                {fmtTime(call.durationSec)}
              </span>
            </div>

            <div className="mt-1 text-[13px] text-ink-2">
              {call.rep.name}{" "}
              <span className="text-ink-3">called</span>{" "}
              {call.prospect.name}, {call.prospect.role} at {call.prospect.company}
            </div>

            {/* Mini-timeline */}
            <div className="mt-3 relative overflow-hidden rounded-sm border border-line bg-paper-2/40">
              <div className="relative h-[12px]">
                {call.segments.filter((s) => s.speaker === "rep").map((s, i) => (
                  <span
                    key={`r-${i}`}
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${(s.startSec / call.durationSec) * 100}%`,
                      width: `${((s.endSec - s.startSec) / call.durationSec) * 100}%`,
                      background: "var(--lane-rep)",
                    }}
                  />
                ))}
              </div>
              <div className="relative h-[12px] border-t border-line/60">
                {call.segments.filter((s) => s.speaker === "prospect").map((s, i) => (
                  <span
                    key={`p-${i}`}
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${(s.startSec / call.durationSec) * 100}%`,
                      width: `${((s.endSec - s.startSec) / call.durationSec) * 100}%`,
                      background: "var(--lane-prospect)",
                    }}
                  />
                ))}
              </div>

              {call.coaching.map((c) => {
                const cfg = severityConfig(c.severity);
                return (
                  <span
                    key={c.id}
                    className="absolute top-[-4px] h-[7px] w-[7px] rounded-full"
                    style={{
                      left: `${(c.atSec / call.durationSec) * 100}%`,
                      transform: "translateX(-50%)",
                      background: cfg.color,
                      boxShadow: `0 0 0 2px var(--card)`,
                    }}
                    title={c.title}
                  />
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {critical > 0 && (
                <CoachingPill label={`${critical} critical`} tone="critical" />
              )}
              {warn > 0 && (
                <CoachingPill label={`${warn} warn`} tone="warn" />
              )}
              {critical === 0 && warn === 0 && (
                <CoachingPill label="All clear" tone="ok" />
              )}
              <span className="mono text-[10.5px] text-ink-3 tabular-nums">
                rep {call.talkRatio.rep}% · prospect {call.talkRatio.prospect}%
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center border-l border-line bg-paper-2/30 px-5 py-5 min-w-[100px]">
            <Score score={call.score} />
            <span className="label !text-[9.5px] mt-1">score</span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

function Score({ score }: { score: number }) {
  const color =
    score >= 80
      ? "var(--signal-green)"
      : score >= 60
        ? "var(--signal-amber)"
        : "var(--accent-2)";
  return (
    <span className="display text-[36px] tabular-nums leading-none" style={{ color }}>
      {score}
    </span>
  );
}

function CoachingPill({
  label,
  tone,
}: {
  label: string;
  tone: "critical" | "warn" | "ok";
}) {
  const cfg = severityConfig(tone);
  return (
    <span
      className="label !text-[9.5px] !tracking-[0.16em] px-2 py-1"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {label}
    </span>
  );
}

function DeckStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "critical";
}) {
  const cfg = severityConfig(tone);
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ background: cfg.color }}
          aria-hidden
        />
        <span className="label !text-[10px]">{label}</span>
      </div>
      <div className="mt-1 display text-[28px] leading-none tabular-nums text-ink">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-16 border border-dashed border-line-2 px-8 py-14 text-center">
      <div className="display-italic text-[22px] text-ink-3">
        No calls match that filter.
      </div>
      <button
        onClick={onReset}
        className="mt-3 text-[12px] text-[color:var(--accent)] hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}

function dateShort(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .toUpperCase();
}

function todayLong() {
  return new Date()
    .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    .toUpperCase();
}
