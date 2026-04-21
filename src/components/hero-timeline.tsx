"use client";

/**
 * HeroTimeline — the animated project-diagram for the Cadence landing.
 *
 * Rule 2: project-specific animated diagram, not a feature grid. This
 * renders a 24-minute sales call "authoring itself" on a 14s loop:
 * lane headers appear, rep + prospect talk-track bars fill in
 * left-to-right, objection and commitment markers drop above their
 * timestamps, a coral play-head sweeps across, and three coaching tag
 * cards pop up with connecting lines back to specific moments.
 *
 * Pure CSS keyframes — no rAF loop.
 */
export function HeroTimeline() {
  return (
    <div className="relative w-full">
      <div className="relative mx-auto max-w-[1040px] border border-line bg-card overflow-hidden">
        {/* Studio top-bar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3 bg-paper-2/50">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-[9px] w-[9px] rounded-full playhead"
              style={{ background: "var(--accent)" }}
            />
            <span className="mono text-[10.5px] text-ink-2 tracking-[0.16em]">
              CALL-0142 · ACME CORP × PROSPECT
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="mono text-[10.5px] text-ink-3 tabular-nums">
              00:00 — 24:37
            </span>
            <span className="label !text-[9.5px]">LIVE DRAFTING</span>
          </div>
        </div>

        {/* Timeline stage */}
        <div className="relative px-6 py-6 md:px-10 md:py-8">
          {/* Lane labels */}
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <div className="flex flex-col gap-[62px] pt-2">
              <LaneLabel color="var(--lane-rep)" name="Maya A." role="rep" delay="0.2s" />
              <LaneLabel color="var(--lane-prospect)" name="J. Chen" role="prospect" delay="0.4s" />
            </div>

            {/* The actual timeline lanes */}
            <div className="relative">
              {/* Coaching tags at the top */}
              <div className="h-[48px] relative">
                <CoachingTag
                  delay="7.0s"
                  leftPct={32}
                  tone="rust"
                  label="Rep talk 72% — best reps avg 45%"
                />
                <CoachingTag
                  delay="9.0s"
                  leftPct={62}
                  tone="amber"
                  label="Missed reference ask @ 15:30"
                />
                <CoachingTag
                  delay="11.0s"
                  leftPct={88}
                  tone="green"
                  label="Strong next-step commit @ 22:10"
                />
              </div>

              {/* Rep lane */}
              <Lane color="var(--lane-rep)" delay="1.0s" segments={REP_SEGMENTS} />

              {/* Prospect lane */}
              <div className="mt-2">
                <Lane
                  color="var(--lane-prospect)"
                  delay="2.4s"
                  segments={PROSPECT_SEGMENTS}
                />
              </div>

              {/* Moment markers row (objections + commits above timestamp ruler) */}
              <div className="relative h-[26px] mt-2">
                <Marker delay="5.0s" leftPct={37} tone="amber" label="OBJ" />
                <Marker delay="6.2s" leftPct={65} tone="amber" label="OBJ" />
                <Marker delay="8.5s" leftPct={90} tone="green" label="COMMIT" />
              </div>

              {/* Timestamp ruler */}
              <div className="relative flex items-baseline justify-between border-t border-line pt-1.5 mt-1">
                {["00:00", "06:00", "12:00", "18:00", "24:37"].map((t, i) => (
                  <span
                    key={t}
                    className="mono text-[9.5px] text-ink-3 tabular-nums"
                    style={{ transform: i === 4 ? "translateX(0)" : undefined }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* The sweeping play-head */}
              <div className="playhead-rail">
                <span className="playhead-line" aria-hidden>
                  <span className="playhead-dot" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom metrics bar */}
        <div className="flex items-center justify-between border-t border-line px-6 py-3 md:px-10 text-[11px] text-ink-3">
          <span className="mono">
            <span style={{ color: "var(--lane-rep)" }}>●</span> rep 58% &nbsp;
            <span style={{ color: "var(--lane-prospect)" }}>●</span> prospect 42% &nbsp;
            <span style={{ color: "var(--signal-amber)" }}>●</span> 2 objections &nbsp;
            <span style={{ color: "var(--signal-green)" }}>●</span> 1 commit
          </span>
          <span className="mono text-[10.5px] tracking-[0.14em]">
            CADENCE v1.4 · signal ok
          </span>
        </div>
      </div>

      <style>{`
        /* 14s master loop across all timeline elements */
        .lane-seg {
          transform-origin: left center;
          transform: scaleX(0);
          opacity: 0.2;
          animation: seg-fill 14s linear infinite both;
        }
        @keyframes seg-fill {
          0%, 5%     { transform: scaleX(0); opacity: 0; }
          25%        { transform: scaleX(1); opacity: 1; }
          85%        { transform: scaleX(1); opacity: 1; }
          92%, 100%  { transform: scaleX(1); opacity: 0; }
        }

        .lane-label {
          opacity: 0;
          transform: translateX(-6px);
          animation: label-life 14s linear infinite both;
        }
        @keyframes label-life {
          0%, 2%    { opacity: 0; transform: translateX(-6px); }
          6%        { opacity: 1; transform: translateX(0); }
          85%       { opacity: 1; transform: translateX(0); }
          92%, 100% { opacity: 0; transform: translateX(-3px); }
        }

        .marker {
          opacity: 0;
          transform: translateY(-6px) scale(0.8);
          animation: marker-drop 14s linear infinite both;
        }
        @keyframes marker-drop {
          0%, 3%    { opacity: 0; transform: translateY(-6px) scale(0.8); }
          8%        { opacity: 1; transform: translateY(0) scale(1);      }
          85%       { opacity: 1; transform: translateY(0) scale(1);      }
          92%, 100% { opacity: 0; transform: translateY(-2px) scale(0.95); }
        }

        .coach-tag {
          opacity: 0;
          transform: translateY(6px) scale(0.94);
          animation: tag-life 14s linear infinite both;
        }
        @keyframes tag-life {
          0%, 3%    { opacity: 0; transform: translateY(6px) scale(0.94); }
          8%        { opacity: 1; transform: translateY(0) scale(1);      }
          85%       { opacity: 1; transform: translateY(0) scale(1);      }
          92%, 100% { opacity: 0; transform: translateY(-3px) scale(0.98); }
        }

        /* Play-head rail spans full timeline width; the line sweeps 0→100% */
        .playhead-rail {
          position: absolute;
          top: 48px;
          left: 0;
          right: 0;
          bottom: 28px;
          pointer-events: none;
        }
        .playhead-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent);
          opacity: 0;
          animation: playhead-sweep 14s linear infinite both;
          box-shadow: 0 0 12px rgba(232, 92, 61, 0.45);
        }
        .playhead-dot {
          position: absolute;
          top: -4px;
          left: -3px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px rgba(232, 92, 61, 0.2);
        }
        @keyframes playhead-sweep {
          0%, 10%   { left: 0%;   opacity: 0; }
          14%       { left: 2%;   opacity: 1; }
          80%       { left: 98%;  opacity: 1; }
          85%       { left: 100%; opacity: 1; }
          92%, 100% { left: 100%; opacity: 0; }
        }

        .tag-line {
          stroke: currentColor;
          stroke-width: 1;
          stroke-dasharray: 2 2;
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
}

type Segment = { startPct: number; widthPct: number };

const REP_SEGMENTS: Segment[] = [
  { startPct: 0, widthPct: 8 },
  { startPct: 10, widthPct: 14 },
  { startPct: 32, widthPct: 12 },
  { startPct: 56, widthPct: 20 },
  { startPct: 90, widthPct: 10 },
];

const PROSPECT_SEGMENTS: Segment[] = [
  { startPct: 8, widthPct: 2 },
  { startPct: 24, widthPct: 8 },
  { startPct: 44, widthPct: 12 },
  { startPct: 76, widthPct: 14 },
];

function Lane({
  color,
  delay,
  segments,
}: {
  color: string;
  delay: string;
  segments: Segment[];
}) {
  return (
    <div
      className="relative h-[22px] rounded-sm border border-line bg-paper-2/40"
      style={{ overflow: "hidden" }}
    >
      {segments.map((s, i) => (
        <span
          key={i}
          className="lane-seg absolute top-0 bottom-0"
          style={{
            left: `${s.startPct}%`,
            width: `${s.widthPct}%`,
            background: color,
            animationDelay: `calc(${delay} + ${i * 0.25}s)`,
          }}
        />
      ))}
    </div>
  );
}

function LaneLabel({
  name,
  color,
  role,
  delay,
}: {
  name: string;
  color: string;
  role: "rep" | "prospect";
  delay: string;
}) {
  return (
    <div className="lane-label" style={{ animationDelay: delay }}>
      <div className="flex items-baseline gap-1.5">
        <span
          className="h-[7px] w-[7px] rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <span className="mono text-[10.5px] text-ink uppercase tracking-[0.08em]">{name}</span>
      </div>
      <div className="mt-0.5 label !text-[9px] !tracking-[0.18em]">{role}</div>
    </div>
  );
}

function Marker({
  delay,
  leftPct,
  tone,
  label,
}: {
  delay: string;
  leftPct: number;
  tone: "amber" | "green";
  label: string;
}) {
  const color = tone === "amber" ? "var(--signal-amber)" : "var(--signal-green)";
  return (
    <span
      className="marker absolute flex flex-col items-center gap-1"
      style={{ left: `${leftPct}%`, transform: "translateX(-50%)", animationDelay: delay }}
    >
      <span
        className="h-[8px] w-[8px] rounded-full"
        style={{ background: color, boxShadow: `0 0 0 3px ${color}33` }}
        aria-hidden
      />
      <span
        className="mono text-[9px] tracking-[0.14em]"
        style={{ color }}
      >
        {label}
      </span>
    </span>
  );
}

function CoachingTag({
  delay,
  leftPct,
  tone,
  label,
}: {
  delay: string;
  leftPct: number;
  tone: "rust" | "amber" | "green";
  label: string;
}) {
  const color =
    tone === "rust"
      ? "var(--accent-2)"
      : tone === "amber"
        ? "var(--signal-amber)"
        : "var(--signal-green)";
  const bg =
    tone === "rust"
      ? "var(--accent-soft)"
      : tone === "amber"
        ? "rgba(212, 137, 31, 0.1)"
        : "rgba(47, 122, 90, 0.1)";
  return (
    <div
      className="coach-tag absolute"
      style={{
        left: `${leftPct}%`,
        transform: "translateX(-50%)",
        animationDelay: delay,
      }}
    >
      <div
        className="inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] leading-tight whitespace-nowrap"
        style={{ borderColor: color, background: bg, color }}
      >
        <span
          aria-hidden
          className="h-[5px] w-[5px] rounded-full"
          style={{ background: color }}
        />
        <span>{label}</span>
      </div>
    </div>
  );
}
