import type { DrinkInput, Legend } from './types'
import { LEGENDS } from '../data/legends'

/** Unit weights per drink, matching the original site's calibration. */
export const UNIT_WEIGHTS = {
  beers: 2.3,
  shots: 1.0,
  wine: 2.1,
  cocktails: 1.8,
} as const

/** André's documented session total, used by the "distance from André" gauge. */
export const ANDRE_UNITS = 360

export const EMPTY_INPUT: DrinkInput = {
  beers: 0,
  shots: 0,
  wine: 0,
  cocktails: 0,
  duration: 4,
}

export function totalUnits(d: Pick<DrinkInput, 'beers' | 'shots' | 'wine' | 'cocktails'>): number {
  return (
    d.beers * UNIT_WEIGHTS.beers +
    d.shots * UNIT_WEIGHTS.shots +
    d.wine * UNIT_WEIGHTS.wine +
    d.cocktails * UNIT_WEIGHTS.cocktails
  )
}

export function totalDrinks(d: Pick<DrinkInput, 'beers' | 'shots' | 'wine' | 'cocktails'>): number {
  return d.beers + d.shots + d.wine + d.cocktails
}

/** Find the legend whose contiguous [minUnits, maxUnits) band contains `units`. */
export function findLegend(units: number, list: Legend[] = LEGENDS): Legend {
  const u = Math.max(0, units)
  return list.find((l) => u >= l.minUnits && u < l.maxUnits) ?? list[list.length - 1]
}

/** Rank from the top: 1 = André (apex), N = the lowest tier. */
export function legendRank(legend: Legend, list: Legend[] = LEGENDS): number {
  const idx = list.findIndex((l) => l.id === legend.id)
  return idx < 0 ? list.length : list.length - idx
}

export interface AndreDistance {
  gap: number
  beersEquiv: number
  commentary: string
}

/** Distance from André's record, or null once you have reached the summit. */
export function andreDistance(units: number): AndreDistance | null {
  if (units >= ANDRE_UNITS) return null
  const gap = Math.round(ANDRE_UNITS - units)
  const beersEquiv = Math.round(gap / UNIT_WEIGHTS.beers)

  let commentary: string
  if (gap > 300) commentary = 'André would not have noticed you were drinking.'
  else if (gap > 200) commentary = 'You have made a respectable start. André had not yet begun.'
  else if (gap > 100) commentary = 'You are in the same conversation as André, but a different chapter.'
  else if (gap > 50) commentary = 'You are within sight of the summit. André would respect the attempt.'
  else if (gap > 20) commentary = 'André would consider this a warm-up. You are close.'
  else commentary = "You are in André's territory. The air is thin up here."

  return { gap, beersEquiv, commentary }
}
