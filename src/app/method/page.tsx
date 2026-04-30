import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export const metadata = {
  title: "Method · Cadence",
  description: "How Cadence turns a call recording into timestamped coaching.",
};

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section className="mx-auto w-full max-w-[960px] px-6 pt-16 pb-10 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <span className="label">THE METHOD · CADENCE v1.4</span>
          <span className="mono text-[10.5px] text-ink-3">APRIL MMXXVI</span>
        </div>

        <h1 className="display mt-10 text-[48px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[72px]">
          How it <span className="display-italic">listens.</span>
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-ink-2">
          Cadence runs six deterministic stages from the moment you drop an
          audio file to the moment a coaching tag is timestamped in the
          transcript. No stage is an unreviewed model completion. No
          coaching tag ships without a specific second of audio to point at.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-6 md:px-10 pb-16">
        <ol className="divide-y divide-line border-y border-line">
          <Stage
            num="01"
            label="Ingest"
            title="Audio in, diarized out"
            body="Accept m4a, mp3, wav, flac up to 3 hours. Files are processed once, then deleted from the processing queue within 24 hours (retained only in your private library)."
          />
          <Stage
            num="02"
            label="Transcribe"
            title="Speaker-separated transcript"
            body="Two-speaker diarization with role inference (who is the rep, who is the prospect) driven by conversation structure, not filename guessing. Confidence scores below threshold are flagged, not hidden."
          />
          <Stage
            num="03"
            label="Segment"
            title="Talk-tracks and silences"
            body="Every utterance is chunked into talk-track segments. Silences over 1.2 seconds are measured — silence-after-objection is a distinct signal from silence-during-feature-walkthrough."
          />
          <Stage
            num="04"
            label="Detect"
            title="Objections, commitments, reference asks"
            body="A classification pass identifies specific conversational moments. Objections require a pattern match plus semantic match. Reference asks are detected on the prospect side only. Commitments are only fired when the rep uses future-tense first-person."
          />
          <Stage
            num="05"
            label="Coach"
            title="Tags with a specific second"
            body="Each coaching tag is derived from a known failure mode and must point at a specific timestamp. 'Talk ratio too high' is not a tag — 'Rep talk 72% vs. best-rep avg 45%' attached to 15:00 is."
          />
          <Stage
            num="06"
            label="Sign"
            title="Clip URL + pipeline version"
            body="Every coaching tag becomes a shareable clip at /clip/<call>/<tag>. Re-running the same audio on a later pipeline produces a new tag set. Old clips keep resolving — the signed version is the artifact."
          />
        </ol>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-6">
          <div>
            <div className="label">What we won&apos;t do</div>
            <ul className="mt-3 space-y-1.5 text-[13px] text-ink-2 max-w-[50ch]">
              <li>— Scrape Zoom / Teams / Meet without explicit file upload.</li>
              <li>— Use your audio to train a shared model.</li>
              <li>— Ship a &lsquo;coaching tag&rsquo; without a timestamp.</li>
              <li>— Require an admin to install us.</li>
            </ul>
          </div>
          <Link
            href="/app/new/"
            className="inline-flex items-center gap-1.5 bg-ink text-paper px-5 py-2.5 text-[13px] font-medium rounded-[3px] hover:bg-ink-2 transition-colors"
          >
            Upload a call
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Stage({
  num, label, title, body,
}: { num: string; label: string; title: string; body: string }) {
  return (
    <li className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[64px_160px_1fr] md:gap-10 md:py-8">
      <div className="mono text-[11px] tabular-nums text-ink-3 tracking-[0.14em] pt-1">{num}</div>
      <div><div className="label">{label}</div></div>
      <div>
        <h3 className="display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink md:text-[26px]">
          {title}<span className="display-italic">.</span>
        </h3>
        <p className="mt-2 max-w-[58ch] text-[13.5px] leading-[1.75] text-ink-2">{body}</p>
      </div>
    </li>
  );
}
