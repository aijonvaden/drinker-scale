# The Legendary Drinker Scale

A reimagining of [drinkinglegends.com](https://drinkinglegends.com): log an evening's drinks and
discover which of **96 of history's great consumers** — real and imagined — you most resemble, from
Betty Ford at the floor to André the Giant at the summit.

Built with React + Vite + TypeScript. Art-Deco gold-on-dark identity, hand-drawn vintage SVG
emblems, animated drink vessels, a shareable result card, and a browsable "Hall of Legends."

## Highlights

- **96 ranked legends** with verdicts and documented "Did You Know" facts in a dry, literate voice.
  The 43 originals are preserved verbatim; ~50 new fiction/pop-culture drinkers were authored and
  fact-checked, then merged into one contiguous, monotonic ladder.
- **Custom emblem system** — a parametric "struck coin" (`LegendEmblem`) with a gilt frame, a
  curved name, a themed motif from a ~60-icon SVG vocabulary, an engraved monogram, and a tier
  accent colour that grades cool → warm as you climb. No photos → no licensing risk.
- **Animated drink inputs** — glasses that fill as you log (`DrinkStepper` / `DrinkVessel`).
- **Shareable result card** — download a 1080×1350 PNG, or copy a link that reproduces the exact
  result (inputs are encoded in the URL; no backend).
- **Hall of Legends** — browse all 96, filter by Real / Fictional / Myth, search, and drill into any
  legend's full record.
- Respects `prefers-reduced-motion`; light responsible-drinking footer.

## Develop

```bash
npm install
npm run dev        # Vite dev server
npm run build      # -> dist/ (static, relative base — open locally or host anywhere)
npm run preview    # serve the production build
```

## Test

```bash
npm run test       # Vitest: ladder integrity, unit math, share round-trip, components
npm run test:e2e   # Playwright: flow, Hall, share, deep-link, responsive, axe a11y,
                   #   reduced-motion — across Chromium / Firefox / WebKit + Chrome & Edge
npm run typecheck  # tsc --noEmit
```

Heavy specs (responsive screenshots, axe, file download) run once under the `chromium` project;
the other engines run the cross-engine functional specs. Screenshots land in
`tests/e2e/__shots__/`.

## The legend data

`src/data/legends.ts` is **auto-generated** — do not edit it by hand. It is produced by:

```bash
node scripts/build-legends.mjs
```

which holds the 43 originals verbatim, reads the workflow-authored new entries, calibrates each new
entry onto the scale by its `intensity` (treated as an approximate target percentile and inverted
through the original units↔percentile curve), and re-derives contiguous `[minUnits, maxUnits)`
bands via midpoints. André is pinned as the apex (`maxUnits: Infinity`). A Vitest suite enforces
the ladder invariants.

## Disclaimer

For entertainment only. Drink responsibly. This is a tribute/parody of the original concept.
