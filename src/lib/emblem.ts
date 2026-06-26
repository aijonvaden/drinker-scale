/** Tier accent bands (hex), cool (mortal) -> warm (legend). Mirrors tokens.css. */
export const BANDS = [
  '#6f8fa3', // 0 slate  — sober / abstinent
  '#5e8d7e', // 1 sage   — casual
  '#8a8a55', // 2 olive  — committed
  '#c08a3a', // 3 brass  — serious
  '#c9a84c', // 4 gold   — legendary
  '#c4772e', // 5 amber  — heroic
  '#a8392a', // 6 ember  — mythic / André
] as const

export type BandIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Map a 0–99.9 percentile to one of the seven accent bands. */
export function bandIndex(percentile: number): BandIndex {
  if (percentile < 5) return 0
  if (percentile < 25) return 1
  if (percentile < 45) return 2
  if (percentile < 65) return 3
  if (percentile < 85) return 4
  if (percentile < 97) return 5
  return 6
}

export function accentForPercentile(percentile: number): string {
  return BANDS[bandIndex(percentile)]
}

const STOP = new Set([
  'the', 'of', 'and', '&', 'von', 'de', 'la', 'le', 'el', 'der', 'di', 'da', 'a', 'an',
])

/**
 * Derive a 1–2 letter monogram for the emblem from a legend's name.
 *  "André the Giant" -> "AG", "The Dude" -> "DU", "E.T." -> "ET", "James Bond" -> "JB"
 */
export function initials(name: string): string {
  const cleaned = name.replace(/[.''’"]/g, '')
  const words = cleaned.split(/[\s\-/]+/).filter((w) => w && !STOP.has(w.toLowerCase()))
  const firsts = words.map((w) => w[0]).filter(Boolean)
  if (firsts.length >= 2) return (firsts[0] + firsts[1]).toUpperCase()
  if (firsts.length === 1) {
    const w = words[0]
    return (w.length >= 2 ? w.slice(0, 2) : w).toUpperCase()
  }
  const fallback = cleaned.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase()
  return fallback || '·'
}
