export type TalkSegment = {
  startSec: number;
  endSec: number;
  speaker: "rep" | "prospect";
};

export type CallMarker = {
  atSec: number;
  kind: "objection" | "commitment" | "question" | "moment";
  label: string;
  note?: string;
};

export type CoachingTag = {
  id: string;
  severity: "critical" | "warn" | "ok";
  atSec: number;
  title: string;
  note: string;
};

export type TranscriptLine = {
  atSec: number;
  speaker: "rep" | "prospect";
  text: string;
  tag?: string; // coaching tag id, if this line is flagged
};

export type Call = {
  id: string;
  slug: string;
  company: string;
  dealValue: string;
  stage: "discovery" | "demo" | "negotiation" | "closing";
  date: string;
  durationSec: number;
  rep: {
    name: string;
    role: string;
    avatar: string;
  };
  prospect: {
    name: string;
    role: string;
    company: string;
  };
  talkRatio: { rep: number; prospect: number };
  score: number; // 0 - 100
  summary: string;
  segments: TalkSegment[];
  markers: CallMarker[];
  coaching: CoachingTag[];
  transcript: TranscriptLine[];
};

function mkSegments(
  pattern: { rep?: [number, number][]; prospect?: [number, number][] },
): TalkSegment[] {
  const out: TalkSegment[] = [];
  pattern.rep?.forEach(([s, e]) => out.push({ startSec: s, endSec: e, speaker: "rep" }));
  pattern.prospect?.forEach(([s, e]) => out.push({ startSec: s, endSec: e, speaker: "prospect" }));
  return out.sort((a, b) => a.startSec - b.startSec);
}

export const CALLS: Call[] = [
  {
    id: "call-0142",
    slug: "call-0142",
    company: "Acme Corp",
    dealValue: "$82K ARR",
    stage: "discovery",
    date: "2026-04-18",
    durationSec: 24 * 60 + 37,
    rep: {
      name: "Maya Alves",
      role: "Senior AE · Velocity Labs",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    prospect: {
      name: "Jordan Chen",
      role: "VP Engineering",
      company: "Acme Corp",
    },
    talkRatio: { rep: 72, prospect: 28 },
    score: 62,
    summary:
      "Discovery call with Acme. Prospect engaged on technical fit but raised two pricing objections. Rep over-indexed on feature coverage; missed a direct reference request at 15:30 and made a delivery commitment that is not yet validated with delivery.",
    segments: mkSegments({
      rep: [
        [0, 125],
        [150, 360],
        [480, 660],
        [840, 1140],
        [1320, 1477],
      ],
      prospect: [
        [125, 150],
        [360, 480],
        [660, 840],
        [1140, 1320],
      ],
    }),
    markers: [
      { atSec: 260, kind: "question", label: "Discovery", note: "Rep asks about current stack" },
      { atSec: 530, kind: "objection", label: "Price", note: "Prospect: \"Budget is tight this quarter.\"" },
      { atSec: 930, kind: "objection", label: "Reference", note: "Prospect asks for a similar-size customer" },
      { atSec: 1330, kind: "commitment", label: "Delivery", note: "Rep commits to Q3 go-live" },
    ],
    coaching: [
      {
        id: "c-talk",
        severity: "critical",
        atSec: 900,
        title: "Rep talk-track at 72%",
        note: "Best-performing discovery calls average 45% rep talk. Pull back on feature walk-throughs; the prospect had three unfinished questions.",
      },
      {
        id: "c-reference",
        severity: "warn",
        atSec: 930,
        title: "Missed reference ask at 15:30",
        note: "Prospect asked: \"Have you deployed for anyone our size?\" Rep pivoted to features without answering. This is the #1 predictor of a stalled deal at this stage.",
      },
      {
        id: "c-delivery",
        severity: "warn",
        atSec: 1330,
        title: "Unvalidated delivery commitment",
        note: "Rep committed to Q3 go-live without checking with Delivery. Follow up in-thread before the prospect circulates this internally.",
      },
    ],
    transcript: [
      { atSec: 0, speaker: "rep", text: "Thanks for making time today, Jordan. Before we dive in — what's the one thing that, by the end of this call, would make this a good use of your half-hour?" },
      { atSec: 18, speaker: "prospect", text: "Honestly, I want to understand if you can handle our scale. We've looked at two vendors and both fell over in the pilot." },
      { atSec: 45, speaker: "rep", text: "That's exactly the right question. Let me show you how our architecture is built for this — we have a proprietary pipeline that..." },
      { atSec: 125, speaker: "prospect", text: "Ok, but specifically — have you deployed for anyone our size?" },
      { atSec: 150, speaker: "rep", text: "Let me come back to that. First let me walk you through our technical capabilities...", tag: "c-talk" },
      { atSec: 530, speaker: "prospect", text: "Budget is tight this quarter. What kind of numbers are we talking about?" },
      { atSec: 560, speaker: "rep", text: "It really depends on scope, but let me walk through the tiers..." },
      { atSec: 930, speaker: "prospect", text: "Sorry, one more time — have you deployed for anyone our size? That's the main thing we need to de-risk.", tag: "c-reference" },
      { atSec: 960, speaker: "rep", text: "We have several customers in your segment. Let me continue on the pricing question..." },
      { atSec: 1330, speaker: "rep", text: "We can absolutely hit a Q3 go-live for a deployment this size, no problem.", tag: "c-delivery" },
      { atSec: 1400, speaker: "prospect", text: "Ok — send over the contract and I'll loop in procurement." },
    ],
  },
  {
    id: "call-0141",
    slug: "call-0141",
    company: "Harborline Logistics",
    dealValue: "$145K ARR",
    stage: "demo",
    date: "2026-04-16",
    durationSec: 41 * 60 + 12,
    rep: {
      name: "Daniel Rodriguez",
      role: "Enterprise AE · Velocity Labs",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    prospect: {
      name: "Sofia Pérez",
      role: "Director of Ops",
      company: "Harborline Logistics",
    },
    talkRatio: { rep: 48, prospect: 52 },
    score: 87,
    summary:
      "Exceptional discovery. Rep ran a textbook two-question diagnostic before opening the demo. Prospect self-sold on the routing feature at 22:00. One open concern (SSO) flagged for follow-up.",
    segments: mkSegments({
      rep: [
        [0, 180],
        [300, 660],
        [900, 1080],
        [1320, 1620],
        [1980, 2220],
        [2400, 2472],
      ],
      prospect: [
        [180, 300],
        [660, 900],
        [1080, 1320],
        [1620, 1980],
        [2220, 2400],
      ],
    }),
    markers: [
      { atSec: 240, kind: "question", label: "Open-ended", note: "\"Walk me through your last quarter.\"" },
      { atSec: 1320, kind: "moment", label: "Self-sell", note: "Prospect describes their own use case for routing" },
      { atSec: 2200, kind: "objection", label: "SSO", note: "Asked about Okta + SCIM" },
      { atSec: 2400, kind: "commitment", label: "Next step", note: "Scheduled a follow-up with procurement" },
    ],
    coaching: [
      {
        id: "c-balance",
        severity: "ok",
        atSec: 400,
        title: "Excellent talk-ratio",
        note: "48% rep / 52% prospect is best-in-class. Rep asked the first open-ended question in the first four minutes and let the prospect self-scope.",
      },
      {
        id: "c-sso",
        severity: "warn",
        atSec: 2200,
        title: "SSO question needs a doc, not a deflection",
        note: "Prospect asked specifically about Okta + SCIM. Rep said \"yes, standard.\" Send the actual SSO brief before the next call or the security team will flag it.",
      },
    ],
    transcript: [
      { atSec: 0, speaker: "rep", text: "Sofia, appreciate the time. Walk me through your last quarter — what went well and what nearly fell over?" },
      { atSec: 180, speaker: "prospect", text: "We had three peak weeks in February. Our routing system couldn't handle the dynamic reassignments and we ended up manually overriding..." },
      { atSec: 1320, speaker: "prospect", text: "Wait — if your system can re-route based on real-time capacity, that's exactly what we built around manually. That would have saved us 200 hours in February alone." },
      { atSec: 2200, speaker: "prospect", text: "One thing I need to flag — our security team will ask about Okta integration. Do you support SSO and SCIM?", tag: "c-sso" },
      { atSec: 2400, speaker: "prospect", text: "Let me loop in procurement — can you do Thursday next week?" },
    ],
  },
  {
    id: "call-0140",
    slug: "call-0140",
    company: "Pinecone Capital",
    dealValue: "$36K ARR",
    stage: "negotiation",
    date: "2026-04-14",
    durationSec: 18 * 60 + 5,
    rep: {
      name: "Priya Patel",
      role: "AE · Velocity Labs",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    prospect: {
      name: "Marcus Webb",
      role: "Head of Platform",
      company: "Pinecone Capital",
    },
    talkRatio: { rep: 55, prospect: 45 },
    score: 74,
    summary:
      "Pricing negotiation. Prospect anchored low; rep held the line on the published tier but conceded on annual-in-advance terms. Two follow-ups outstanding: security review and legal redlines.",
    segments: mkSegments({
      rep: [
        [0, 120],
        [240, 540],
        [720, 840],
        [960, 1085],
      ],
      prospect: [
        [120, 240],
        [540, 720],
        [840, 960],
      ],
    }),
    markers: [
      { atSec: 130, kind: "objection", label: "Anchor", note: "Prospect opens at 40% below published tier" },
      { atSec: 600, kind: "commitment", label: "Terms", note: "Rep concedes to annual-in-advance payment" },
      { atSec: 1000, kind: "moment", label: "Next steps", note: "Security review + legal agreed" },
    ],
    coaching: [
      {
        id: "c-hold",
        severity: "ok",
        atSec: 200,
        title: "Held the line cleanly",
        note: "Rep did not discount the list price. Pivoted to terms (annual-in-advance) which is a cheaper concession with higher apparent value.",
      },
      {
        id: "c-silence",
        severity: "ok",
        atSec: 140,
        title: "Used silence well",
        note: "After prospect anchored, rep paused 4.2 seconds before responding. Best practice.",
      },
    ],
    transcript: [
      { atSec: 120, speaker: "prospect", text: "We were thinking more in the $22K range, not $36." },
      { atSec: 140, speaker: "rep", text: "…[4.2s pause]… I hear you. The list price is what it is — but let me ask about your payment terms. If we structured this as annual-in-advance, would that change the calculus?" },
      { atSec: 540, speaker: "prospect", text: "Annual-in-advance works for us if we can lock the rate for two years." },
      { atSec: 560, speaker: "rep", text: "Deal. Let me get that on paper." },
    ],
  },
];

export function getCall(slug: string): Call | undefined {
  return CALLS.find((c) => c.slug === slug);
}

export function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function stageConfig(s: Call["stage"]) {
  return {
    discovery: { label: "DISCOVERY", ink: "#4a4642" },
    demo: { label: "DEMO", ink: "#2f7a5a" },
    negotiation: { label: "NEGOTIATION", ink: "#d4891f" },
    closing: { label: "CLOSING", ink: "#8f2d1d" },
  }[s];
}

export function severityConfig(s: CoachingTag["severity"]) {
  return {
    critical: { label: "CRITICAL", color: "var(--accent-2)", bg: "var(--accent-soft)" },
    warn: { label: "WARN", color: "var(--signal-amber)", bg: "rgba(212, 137, 31, 0.1)" },
    ok: { label: "OK", color: "var(--signal-green)", bg: "rgba(47, 122, 90, 0.1)" },
  }[s];
}
