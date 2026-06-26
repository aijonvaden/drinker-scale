import type { ReactNode } from 'react'

/**
 * Motif library. Each entry is the inner geometry of a 0 0 24 24 icon.
 * They are rendered inside a <g fill="none" stroke="currentColor"> wrapper,
 * so most use strokes; a few opt into fill via fill="currentColor".
 *
 * The emblem's *identity* is carried by the engraved monogram + coin frame —
 * the motif is a supporting symbol. Any unknown keyword falls back to `cocktail`.
 */
export type MotifId = string

const f = { fill: 'currentColor', stroke: 'none' } as const

export const MOTIFS: Record<string, ReactNode> = {
  // ── Vessels ──────────────────────────────────────────
  martini: (
    <>
      <path d="M4 5h16L12 14z" />
      <path d="M12 14v5" />
      <path d="M8 20h8" />
    </>
  ),
  cocktail: (
    <>
      <path d="M5 6h14l-6 7z" />
      <path d="M13 13v6" />
      <path d="M9 20h8" />
      <path d="M17 4l-2 4" />
      <circle cx="17" cy="4" r="1.1" {...f} />
    </>
  ),
  beer: (
    <>
      <path d="M7 8h8v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      <path d="M15 10h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
      <path d="M7 8c0-2 1.6-3 4-3s4 1 4 3" />
      <path d="M9 5.2c0-1 .8-1.6 1.6-1.4M12.5 5c.2-1 1-1.4 1.8-1.1" />
    </>
  ),
  'beer-can': (
    <>
      <rect x="8" y="4" width="8" height="16" rx="1.4" />
      <path d="M8 8h8" />
      <path d="M10.5 12h3v4h-3z" {...f} />
    </>
  ),
  tankard: (
    <>
      <path d="M7 6h9v14H7z" />
      <path d="M16 9h2.5a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5H16" />
      <path d="M7 10h9" />
    </>
  ),
  wine: (
    <>
      <path d="M8 4h8c0 4-1.5 7-4 7s-4-3-4-7z" />
      <path d="M12 11v7" />
      <path d="M8 20h8" />
    </>
  ),
  champagne: (
    <>
      <path d="M9 4h6l-.8 9a2.2 2.2 0 0 1-4.4 0z" />
      <path d="M12 13v6" />
      <path d="M9 20h6" />
      <circle cx="17" cy="5" r="0.8" {...f} />
      <circle cx="6.5" cy="7" r="0.8" {...f} />
    </>
  ),
  'whiskey-tumbler': (
    <>
      <path d="M7 7h10l-1 12H8z" />
      <path d="M9.5 11h5l-.4 5h-4.2z" {...f} />
    </>
  ),
  'shot-glass': (
    <>
      <path d="M8 6h8l-1 13H9z" />
      <path d="M8.6 12h6.8" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4v5l4 9a2 2 0 0 1-1.8 3H7.8A2 2 0 0 1 6 17l4-9z" />
      <path d="M9 3h6" />
      <path d="M7.6 15h8.8" />
    </>
  ),
  barrel: (
    <>
      <path d="M6 5h12c1.5 4 1.5 10 0 14H6c-1.5-4-1.5-10 0-14z" />
      <path d="M5 9h14M5 15h14" />
      <path d="M12 5v14" />
    </>
  ),
  grapes: (
    <>
      <circle cx="9" cy="11" r="2" />
      <circle cx="13" cy="11" r="2" />
      <circle cx="11" cy="14.5" r="2" />
      <circle cx="15" cy="14.5" r="2" />
      <circle cx="13" cy="18" r="2" />
      <path d="M13 9c0-3 1.5-4 4-4.5" />
    </>
  ),
  tiki: (
    <>
      <path d="M8 4h8v13a4 4 0 0 1-8 0z" />
      <path d="M9.5 8.5l2 1.5-2 1.5M14.5 8.5l-2 1.5 2 1.5" />
      <path d="M10 15h4" />
    </>
  ),

  // ── Identity / character ─────────────────────────────
  skull: (
    <>
      <path d="M5 11a7 7 0 0 1 14 0v3a2 2 0 0 1-1 1.7V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3.3A2 2 0 0 1 5 14z" />
      <circle cx="9" cy="12" r="1.6" {...f} />
      <circle cx="15" cy="12" r="1.6" {...f} />
      <path d="M11 16h2" />
    </>
  ),
  crown: (
    <>
      <path d="M4 9l3 7h10l3-7-4 3-4-6-4 6z" />
      <path d="M6 19h12" />
    </>
  ),
  mask: (
    <>
      <path d="M5 5c4 1 10 1 14 0 1 7-1 13-7 14C6 18 4 12 5 5z" />
      <path d="M9 10c1-.8 2-.8 3 0M12 10c1-.8 2-.8 3 0" />
      <path d="M9.5 15c1.5 1.5 3.5 1.5 5 0" />
    </>
  ),
  'mask-comedy': (
    <>
      <path d="M5 5c4 1 10 1 14 0 1 7-1 13-7 14C6 18 4 12 5 5z" />
      <path d="M9 11h2M13 11h2" />
      <path d="M9 15c1.5 2 4 2 6 0" />
    </>
  ),
  'mask-tragedy': (
    <>
      <path d="M5 5c4 1 10 1 14 0 1 7-1 13-7 14C6 18 4 12 5 5z" />
      <path d="M9 12h2M13 12h2" />
      <path d="M9 17c1.5-2 4-2 6 0" />
    </>
  ),
  medal: (
    <>
      <path d="M8 3l2 6M16 3l-2 6" />
      <circle cx="12" cy="15" r="5" />
      <path d="M12 12.5l1 2 2 .3-1.4 1.5.3 2-1.9-1-1.9 1 .3-2L9 14.8l2-.3z" {...f} />
    </>
  ),
  'top-hat': (
    <>
      <path d="M8 4h8v11H8z" />
      <path d="M4 15h16" />
      <path d="M8 12h8" />
    </>
  ),
  monocle: (
    <>
      <circle cx="10" cy="11" r="5" />
      <path d="M14 13l4 6" />
      <path d="M6 4l2 3" />
    </>
  ),
  pipe: (
    <>
      <path d="M4 10h8v2a4 4 0 0 1-8 0z" />
      <path d="M12 10v-1a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3" />
    </>
  ),
  cigar: (
    <>
      <rect x="4" y="11" width="13" height="3" rx="1.4" />
      <path d="M17 12.5h2" />
      <path d="M19 9c1 1 1 2 0 3" />
    </>
  ),
  diamond: (
    <>
      <path d="M6 9h12l-6 11z" />
      <path d="M6 9l2-4h8l2 4" />
      <path d="M10 5L8 9M14 5l2 4M9 9l3 11 3-11" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9.5 13l-2 8 4.5-3 4.5 3-2-8" />
    </>
  ),
  'glass-milk': (
    <>
      <path d="M8 4h8l-1 16H9z" />
      <path d="M8.4 9h7.2" />
    </>
  ),

  // ── Music ────────────────────────────────────────────
  drum: (
    <>
      <ellipse cx="12" cy="8" rx="7" ry="3" />
      <path d="M5 8v6c0 1.7 3.1 3 7 3s7-1.3 7-3V8" />
      <path d="M6 10l12 4M18 10L6 14" />
    </>
  ),
  guitar: (
    <>
      <path d="M16 4l4 4-2 2-1-1-5 5a3 3 0 1 1-2-2l5-5-1-1z" />
      <circle cx="9.5" cy="14.5" r="1.4" {...f} />
    </>
  ),
  microphone: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M7 11a5 5 0 0 0 10 0" />
      <path d="M12 16v4M9 20h6" />
    </>
  ),

  // ── Sport ────────────────────────────────────────────
  football: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7l3 2-1 4h-4l-1-4z" {...f} />
      <path d="M12 4v3M5 9l3.5 2M19 9l-3.5 2M8 19l1.5-4M16 19l-1.5-4" />
    </>
  ),
  baseball: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M6.5 6.5c2 2 2 9 0 11M17.5 6.5c-2 2-2 9 0 11" />
    </>
  ),
  golf: (
    <>
      <path d="M9 4v13" />
      <path d="M9 4l7 2.5L9 9" {...f} />
      <ellipse cx="12" cy="19" rx="5" ry="1.6" />
    </>
  ),

  // ── Screen / letters / art ───────────────────────────
  'film-reel': (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" {...f} />
      <circle cx="12" cy="6.5" r="1.4" {...f} />
      <circle cx="12" cy="17.5" r="1.4" {...f} />
      <circle cx="6.5" cy="12" r="1.4" {...f} />
      <circle cx="17.5" cy="12" r="1.4" {...f} />
    </>
  ),
  clapperboard: (
    <>
      <path d="M4 9h16v9H4z" />
      <path d="M4 9l1.5-3 3 1 1.5-3 3 1 1.5-3 3 1L20 6" />
      <path d="M4 9l16 0" />
    </>
  ),
  typewriter: (
    <>
      <path d="M6 8h12v4H6z" />
      <path d="M4 12h16v6H4z" />
      <path d="M9 5h6v3H9z" />
      <path d="M8 15h8" />
    </>
  ),
  quill: (
    <>
      <path d="M20 4c-7 1-12 6-13 13l3-3" />
      <path d="M7 14l6-6" />
      <path d="M4 20l3-3" />
    </>
  ),
  book: (
    <>
      <path d="M5 5h7v15H7a2 2 0 0 1-2-2z" />
      <path d="M19 5h-7v15h5a2 2 0 0 0 2-2z" />
      <path d="M12 5v15" />
    </>
  ),
  newspaper: (
    <>
      <path d="M5 5h14v14H6a1 1 0 0 1-1-1z" />
      <path d="M8 8h5v4H8z" {...f} />
      <path d="M14 8h3M14 11h3M8 14h9M8 16h9" />
    </>
  ),
  palette: (
    <>
      <path d="M12 4a8 8 0 1 0 0 16 2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H17a3 3 0 0 0 3-3C20 7 16.4 4 12 4z" />
      <circle cx="8" cy="10" r="1" {...f} />
      <circle cx="12" cy="8" r="1" {...f} />
      <circle cx="16" cy="10" r="1" {...f} />
    </>
  ),

  // ── Adventure / arms ─────────────────────────────────
  'pirate-flag': (
    <>
      <path d="M5 4v16" />
      <path d="M5 4h13v9H5z" />
      <circle cx="11.5" cy="7.5" r="1.6" {...f} />
      <path d="M8 11l7-3M15 11L8 8" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v12" />
      <path d="M7 11h10" />
      <path d="M5 13a7 7 0 0 0 14 0" />
    </>
  ),
  'ship-wheel': (
    <>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" {...f} />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
    </>
  ),
  sword: (
    <>
      <path d="M19 3l-9 9" />
      <path d="M5 19l3-3 1 1-3 3z" />
      <path d="M9 15l-3 1 1-3" />
      <path d="M7 17l-3 3" />
    </>
  ),
  'crossed-swords': (
    <>
      <path d="M5 4l10 10M5 8l3-3" />
      <path d="M19 4L9 14M19 8l-3-3" />
      <path d="M9 16l-2 4M15 16l2 4" />
    </>
  ),
  pistol: (
    <>
      <path d="M4 7h13v4h-3l-1 3h-3l-1-3H7z" />
      <path d="M7 11l-1 6" />
      <path d="M17 8h2v2" />
    </>
  ),

  // ── Sci-fi / cosmos ──────────────────────────────────
  alien: (
    <>
      <path d="M12 3c4 0 6 3 6 7 0 5-3 11-6 11s-6-6-6-11c0-4 2-7 6-7z" />
      <path d="M9 11c1 1.5 1 3 0 4M15 11c-1 1.5-1 3 0 4" />
    </>
  ),
  robot: (
    <>
      <rect x="6" y="8" width="12" height="10" rx="1.5" />
      <path d="M12 4v4M10 4h4" />
      <circle cx="9.5" cy="12" r="1.3" {...f} />
      <circle cx="14.5" cy="12" r="1.3" {...f} />
      <path d="M9.5 15.5h5" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3 2 4 6 4 10l-4 3-4-3c0-4 1-8 4-10z" />
      <circle cx="12" cy="10" r="1.6" {...f} />
      <path d="M8 14l-2 4 4-2M16 14l2 4-4-2" />
    </>
  ),
  moon: (
    <>
      <path d="M16 4a8 8 0 1 0 4 12A7 7 0 0 1 16 4z" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.6" {...f} />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
    </>
  ),
  'ray-gun': (
    <>
      <path d="M4 9h9l3-2v4l-3-2" />
      <path d="M4 9v3h5l1 4h2l-1-4" />
      <circle cx="6.5" cy="10.5" r="0.8" {...f} />
    </>
  ),

  // ── Misc iconography ─────────────────────────────────
  lightning: (
    <>
      <path d="M13 3l-7 10h5l-2 8 8-11h-5z" {...f} />
    </>
  ),
  bat: (
    <>
      <path d="M12 8c-1-2-3-3-5-3 .5 1 0 2-1 2 2 1 2 3 1 4 2 0 3 1 4 3 1-2 2-3 4-3-1-1-1-3 1-4-1 0-1.5-1-1-2-2 0-4 1-5 3z" />
    </>
  ),
  car: (
    <>
      <path d="M4 14l2-5h12l2 5v3h-2" />
      <path d="M8 17H6" />
      <path d="M4 14h16" />
      <circle cx="8" cy="17" r="1.6" />
      <circle cx="16" cy="17" r="1.6" />
    </>
  ),
  plane: (
    <>
      <path d="M12 3l2 8 6 4v2l-8-2-2 5-2-5-2 1v-2l2-1-1-3 1-1 2 1z" {...f} />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="9" r="4" />
      <path d="M11 12l8 8" />
      <path d="M16 17l2-2M18 19l2-2" />
    </>
  ),
  'jail-bars': (
    <>
      <path d="M5 4v16M9.5 4v16M14.5 4v16M19 4v16" />
      <path d="M5 8h14M5 16h14" />
    </>
  ),
  mountain: (
    <>
      <path d="M3 19l6-12 3 5 2-3 7 10z" />
      <path d="M7 12l2 2 2-2" />
    </>
  ),
  lion: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6 6l1.5 1.5M16.5 16.5L18 18M18 6l-1.5 1.5M7.5 16.5L6 18" />
      <circle cx="10" cy="11" r="0.7" {...f} />
      <circle cx="14" cy="11" r="0.7" {...f} />
      <path d="M10.5 14c.8.7 2.2.7 3 0" />
    </>
  ),
  puppet: (
    <>
      <circle cx="12" cy="9" r="4" />
      <path d="M12 13v6" />
      <path d="M9 16l-3 3M15 16l3 3" />
      <path d="M12 9l4-2" />
    </>
  ),
  dice: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <circle cx="9" cy="9" r="1.1" {...f} />
      <circle cx="15" cy="9" r="1.1" {...f} />
      <circle cx="12" cy="12" r="1.1" {...f} />
      <circle cx="9" cy="15" r="1.1" {...f} />
      <circle cx="15" cy="15" r="1.1" {...f} />
    </>
  ),
  'playing-card': (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1.6" />
      <path d="M12 8l2.5 3-2.5 3-2.5-3z" {...f} />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5.5" />
      <path d="M12 9.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2L9 11.6l2-.3z" {...f} />
    </>
  ),
  'wonder-star': (
    <>
      <path d="M12 2l2.4 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.6-.5z" {...f} />
    </>
  ),
}

/** Resolve a motif id to renderable geometry, with a graceful fallback. */
export function motif(id: string): ReactNode {
  return MOTIFS[id] ?? MOTIFS.cocktail
}

/** Whether a motif id is implemented (used by data-integrity tests). */
export function hasMotif(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(MOTIFS, id)
}
