# Cadence — Revenue-call intelligence

>  Upload a recorded sales call, get timestamped coaching.

## M0 — Design direction (LOCKED)

Per the portfolio rule, fixed before any scaffolding.

### Reference vibe
**Figma's recent marketing + Pitch + Studio-software aesthetics** (Ableton, Logic Pro). Horizontal-time-first layouts. Waveform-and-transcript as the hero motif. Confident warm palette. Feels like a podcast studio that also happens to be a coaching console.

**Inspiration sites to clone the vibe of:**
- Pitch.com (deep warm background + crisp sans)
- Figma config microsites (playful but confident, motion-forward)
- Linear changelog (dense but breathable typography)

### Typography
- **Display**: Fraunces (variable, supple axis for italic flourishes, opsz for headline sizes) — a genuinely distinctive display serif not used on Axon (Inter), Loupe (Inter), Chorus (Source Serif), or Dossier (Newsreader).
- **Body + UI**: Work Sans — humanist sans with clear italic; distinct from Inter/Public Sans/Geist.
- **Mono**: IBM Plex Mono — squared-feeling mono, distinct from JetBrains Mono used elsewhere.

### Layout
- **Horizontal-time-first**. The app's primary surface is a scrubbable call timeline: top row is participant lanes (rep / prospect), middle row is transcript, right rail is coaching tags.
- Landing hero shows a **horizontal animated call timeline** with talk-track colored bars, objection markers, and a floating play-head that sweeps across the call while coaching tags pop up.
- No top-navigation-then-sidebar pattern. Use **side-panel-on-right** for coaching context, **top-bar-only** for navigation.
- Distinct from Dossier's no-sidebar editorial canvas and Chorus's left-sidebar-with-studies.

### Palette — "Studio light"
- `--paper`: `#faf8f5` (warm bone)
- `--paper-2`: `#f1ede4` (slightly warmer base for cards)
- `--ink`: `#181716` (deep charcoal, not true black — reads warmer)
- `--ink-2`: `#4a4642`
- `--ink-3`: `#85807a`
- `--line`: `#e8e2d5`
- `--accent`: `#e85c3d` (coral — audio-forward, warm, not-editorial-red)
- `--accent-2`: `#8f2d1d` (rust — for deeper emphasis)
- `--signal-green`: `#2f7a5a` (commit markers — "deal signal")
- `--signal-amber`: `#d4891f` (objection / risk markers)

Single-color discipline: coral for play-head and primary CTAs; rust for deep emphasis; green/amber only inside the coaching timeline itself.

## Audience
- SDR / AE individual contributors (upload their own calls, self-coach)
- Sales managers (coaching review)
- Revenue ops / enablement (call library + scoring trends)

## Real problem
A typical AE does 6–10 sales calls a week. Managers listen to maybe 2 in a good month. The coaching that actually moves pipeline — "you talked 72% of the discovery call; you missed an asked-for reference; you committed to a delivery date that wasn't real" — is buried in audio nobody replays. Gong and Chorus.ai own the enterprise end of this market with $30K+ ACVs. There is room for a self-serve version that a single AE could pay for from their own expense budget.

## What Cadence is
Upload a call recording → Cadence transcribes, extracts talk-tracks, detects objections and commitments, and renders a coaching timeline. Every coaching tag is timestamped and linkable: the AE can share a 35-second clip to their manager with a specific "talk-track imbalance" annotation. No IT ticket to install.

## Stack
- Next 16 static export + Cloudflare Workers + Static Assets (same deploy pattern as prior projects)
- next/font for Fraunces + Work Sans + IBM Plex Mono
- framer-motion for waveform animation, timeline scrubber, tag reveals
- lucide-react for icons
- Recharts or bare SVG for talk-track pie / timeline bar

## Landing page requirements (portfolio rule 2)
1. **Animated hero diagram**: A horizontal 60-second call timeline authoring itself. Talk-track lanes fill in left-to-right (rep blue-gray vs prospect coral) with objection/commitment markers popping in above specific timestamps. A floating play-head sweeps across on a loop. Coaching tag cards materialize to the right with small timestamp pins connecting back.
2. **Inline real product component**: A `CoachingTimeline` component from the app rendered directly on the landing with 3 call samples + talk-track bars + clickable tags + a "play from 02:14" button that animates the play-head.

## Milestones
- M0 — Design direction (this doc)
- M1 — Scaffold + landing + deploy
- M2 — Calls library (index + upload placeholder)
- M3 — Call reader (waveform + transcript + coaching tags)
- M4 — Shareable clip URL
- M5 — /method + /security
- M6 — Polish + README
