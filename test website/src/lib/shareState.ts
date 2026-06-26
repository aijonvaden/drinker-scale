import type { DrinkInput } from './types'

const clampInt = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Math.round(n)))

/** Encode the drink input into a compact, shareable query string. */
export function encodeState(d: DrinkInput): string {
  const p = new URLSearchParams()
  if (d.beers) p.set('b', String(d.beers))
  if (d.shots) p.set('s', String(d.shots))
  if (d.wine) p.set('w', String(d.wine))
  if (d.cocktails) p.set('c', String(d.cocktails))
  p.set('h', String(d.duration))
  return p.toString()
}

/** Decode a query string back into a DrinkInput, or null if it carries no drinks. */
export function decodeState(search: string): DrinkInput | null {
  const p = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const num = (k: string, hi: number) => {
    const v = p.get(k)
    if (v === null) return 0
    const n = Number(v)
    return Number.isFinite(n) ? clampInt(n, 0, hi) : 0
  }
  const beers = num('b', 200)
  const shots = num('s', 100)
  const wine = num('w', 100)
  const cocktails = num('c', 100)
  const hRaw = Number(p.get('h'))
  const duration = clampInt(Number.isFinite(hRaw) && hRaw > 0 ? hRaw : 4, 1, 24)
  if (beers + shots + wine + cocktails === 0) return null
  return { beers, shots, wine, cocktails, duration }
}

/** Full shareable URL for the current input. */
export function buildShareUrl(d: DrinkInput): string {
  const base = typeof location !== 'undefined' ? location.origin + location.pathname : ''
  return `${base}?${encodeState(d)}`
}
