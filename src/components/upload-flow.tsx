"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileAudio, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "running" | "done";

type Step = {
  id: string;
  label: string;
  detail: string;
  ms: number;
};

const PIPELINE: Step[] = [
  { id: "upload", label: "Uploading audio", detail: "call-0143.m4a · 28m 04s · 42 MB", ms: 700 },
  { id: "transcribe", label: "Transcribing", detail: "diarized · 2 speakers · 3,412 tokens", ms: 1300 },
  { id: "segment", label: "Segmenting talk-tracks", detail: "rep lanes: 11 segments · prospect: 9", ms: 700 },
  { id: "detect", label: "Detecting moments", detail: "objections, commitments, reference asks", ms: 900 },
  { id: "coach", label: "Generating coaching", detail: "talk ratio · silence handling · next-step", ms: 1100 },
  { id: "publish", label: "Publishing to library", detail: "signed · linkable clips · done", ms: 500 },
];

export function UploadFlow() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function go() {
    if (!fileName) return;
    setPhase("running");
    setStepIndex(0);
    setLogs([]);
    run(0);
  }

  function run(i: number) {
    if (i >= PIPELINE.length) {
      setPhase("done");
      return;
    }
    setStepIndex(i);
    setLogs((l) => [...l, PIPELINE[i].detail]);
    timerRef.current = window.setTimeout(() => run(i + 1), PIPELINE[i].ms);
  }

  function handleFile(f: File | null) {
    if (!f) return;
    setFileName(f.name);
  }

  return (
    <div className="mx-auto max-w-[1000px] px-6 pt-10 pb-24 md:px-8">
      <div className="flex items-baseline justify-between border-b border-ink pb-3">
        <span className="label">
          UPLOAD · STEP {phase === "idle" ? "01" : phase === "running" ? "02" : "03"}
        </span>
        <span className="mono text-[10.5px] text-ink-3">CADENCE v1.4</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14"
          >
            <div>
              <h1 className="display text-[46px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[60px]">
                Drop a call recording.{" "}
                <span className="display-italic">Walk away.</span>
              </h1>
              <p className="mt-4 max-w-[54ch] text-[14.5px] leading-[1.7] text-ink-2">
                Cadence supports m4a, mp3, wav, flac. Up to 3 hours per file.
                Your audio is transcribed locally-equivalent; nothing is
                shared with any other Cadence user.
              </p>

              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files[0] ?? null);
                }}
                className={[
                  "mt-8 block cursor-pointer border-2 border-dashed px-6 py-10 text-center transition-colors",
                  dragOver
                    ? "border-[color:var(--accent)] bg-accent-soft/40"
                    : "border-line-2 bg-card hover:border-ink-3",
                ].join(" ")}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <Upload className="mx-auto h-6 w-6 text-ink-3" strokeWidth={1.5} />
                <div className="mt-3 display text-[20px] text-ink">
                  {fileName ? (
                    <span className="inline-flex items-center gap-2">
                      <FileAudio className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.75} />
                      {fileName}
                    </span>
                  ) : (
                    <>
                      Drop an audio file or{" "}
                      <span className="display-italic text-[color:var(--accent)]">
                        browse
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1 text-[12px] text-ink-3">
                  {fileName ? "ready to process" : "m4a · mp3 · wav · up to 3hr"}
                </div>
              </label>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() =>
                    handleFile(new File([], "sample-acme-discovery.m4a"))
                  }
                  className="text-[12px] text-ink-3 hover:text-[color:var(--accent)] underline-offset-2 hover:underline transition-colors"
                >
                  or use a sample call →
                </button>
                <button
                  onClick={go}
                  disabled={!fileName}
                  className="inline-flex items-center gap-1.5 bg-ink text-paper px-5 py-2.5 text-[13px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Process call
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>

            <aside className="border border-line bg-card">
              <div className="border-b border-line px-5 py-3">
                <span className="label">What happens next</span>
              </div>
              <ol className="divide-y divide-line">
                {PIPELINE.map((s, i) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-[32px_1fr] gap-2 px-5 py-3 text-[12.5px]"
                  >
                    <span className="mono text-[10.5px] tabular-nums text-ink-3 pt-0.5">
                      0{i + 1}
                    </span>
                    <div>
                      <div className="text-ink">{s.label}</div>
                      <div className="text-[11px] text-ink-3 leading-[1.5]">
                        {s.detail}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </motion.div>
        )}

        {phase !== "idle" && (
          <motion.div
            key="running"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <div className="flex flex-wrap items-baseline gap-4 border-b border-line pb-3">
              <span className="mono text-[11.5px] text-ink">{fileName}</span>
              <span aria-hidden className="text-ink-4">·</span>
              <span className="label !text-[10px]">
                {phase === "running" ? "PROCESSING" : "READY"}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1fr_300px] md:gap-14">
              <ol className="space-y-4">
                {PIPELINE.map((s, i) => {
                  const state =
                    i < stepIndex || phase === "done"
                      ? "done"
                      : i === stepIndex
                        ? "running"
                        : "pending";
                  return (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: state === "pending" ? 0.35 : 1 }}
                      className="grid grid-cols-[44px_1fr] gap-4"
                    >
                      <div className="pt-1">
                        <PipelineDot state={state} />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="display text-[19px] leading-tight text-ink">
                            {s.label}
                          </span>
                          {state === "done" && (
                            <span className="mono text-[10px] text-[color:var(--signal-green)]">✓</span>
                          )}
                        </div>
                        <div className="text-[12.5px] text-ink-3 mt-0.5">
                          {s.detail}
                        </div>
                        {state === "running" && (
                          <div className="mt-2 h-[1px] overflow-hidden bg-line">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: s.ms / 1000, ease: "linear" }}
                              className="h-full"
                              style={{ background: "var(--accent)" }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </ol>

              <aside className="border border-line bg-card">
                <div className="border-b border-line px-4 py-2.5">
                  <span className="label">Pipeline log</span>
                </div>
                <div className="p-4 mono text-[11px] leading-[1.55] text-ink-2 max-h-[360px] overflow-y-auto">
                  {logs.length === 0 && (
                    <div className="text-ink-3">$ waiting...</div>
                  )}
                  {logs.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-1.5"
                    >
                      <span className="text-[color:var(--accent)]">→</span>{" "}
                      {l}
                    </motion.div>
                  ))}
                  {phase === "done" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t border-line text-ink"
                    >
                      <span className="text-[color:var(--signal-green)]">✓</span>{" "}
                      signed · call-0143 · 3 coaching tags generated
                    </motion.div>
                  )}
                </div>
              </aside>
            </div>

            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-5"
              >
                <div>
                  <div className="label">Call ready</div>
                  <div className="display mt-1 text-[22px] text-ink">
                    Acme Corp &mdash;{" "}
                    <span className="display-italic">discovery.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setPhase("idle");
                      setStepIndex(-1);
                      setFileName(null);
                      setLogs([]);
                    }}
                    className="text-[12px] text-ink-3 hover:text-ink"
                  >
                    Upload another
                  </button>
                  <Link
                    href="/app/call-0142/"
                    className="inline-flex items-center gap-1.5 bg-ink text-paper px-5 py-2.5 text-[13px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors"
                  >
                    Open the call
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PipelineDot({ state }: { state: "pending" | "running" | "done" }) {
  if (state === "running") {
    return (
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: "var(--accent)", opacity: 0.4 }}
        />
        <span
          className="relative h-[9px] w-[9px] rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </span>
    );
  }
  if (state === "done") {
    return (
      <span
        className="inline-block h-[9px] w-[9px] rounded-full"
        style={{ background: "var(--ink)" }}
      />
    );
  }
  return (
    <span
      className="inline-block h-[9px] w-[9px] rounded-full border"
      style={{ borderColor: "var(--line-2)" }}
    />
  );
}
