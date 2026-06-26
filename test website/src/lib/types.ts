export type LegendKind = 'real' | 'fictional' | 'mythological' | 'archetype'

export interface Legend {
  id: string
  name: string
  era: string
  motif: string
  kind: LegendKind
  /** Inclusive lower bound (units). */
  minUnits: number
  /** Exclusive upper bound (units). Infinity for the apex. */
  maxUnits: number
  /** 0–99.9, monotonic up the ladder. */
  percentile: number
  verdict: string
  fact: string
}

export interface DrinkInput {
  beers: number
  shots: number
  wine: number
  cocktails: number
  /** Hours over which the session took place. */
  duration: number
}
