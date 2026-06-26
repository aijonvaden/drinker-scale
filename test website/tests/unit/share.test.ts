import { describe, it, expect } from 'vitest'
import { encodeState, decodeState } from '../../src/lib/shareState'
import type { DrinkInput } from '../../src/lib/types'

const cases: DrinkInput[] = [
  { beers: 10, shots: 2, wine: 1, cocktails: 3, duration: 5 },
  { beers: 0, shots: 7, wine: 0, cocktails: 0, duration: 1 },
  { beers: 200, shots: 100, wine: 100, cocktails: 100, duration: 24 },
  { beers: 1, shots: 0, wine: 0, cocktails: 0, duration: 4 },
]

describe('share state round-trip', () => {
  it('encodes then decodes to the same input', () => {
    for (const input of cases) {
      const decoded = decodeState(encodeState(input))
      expect(decoded).toEqual(input)
    }
  })

  it('returns null when no drinks are present', () => {
    expect(decodeState('h=4')).toBeNull()
    expect(decodeState('')).toBeNull()
  })

  it('tolerates a leading ? and clamps out-of-range values', () => {
    expect(decodeState('?b=10&h=5')).toEqual({
      beers: 10,
      shots: 0,
      wine: 0,
      cocktails: 0,
      duration: 5,
    })
    const clamped = decodeState('b=99999&s=-4&h=999')
    expect(clamped).not.toBeNull()
    expect(clamped!.beers).toBe(200)
    expect(clamped!.shots).toBe(0)
    expect(clamped!.duration).toBe(24)
  })

  it('omits zero fields from the query but always keeps duration', () => {
    const q = encodeState({ beers: 3, shots: 0, wine: 0, cocktails: 0, duration: 6 })
    expect(q).toContain('b=3')
    expect(q).not.toContain('s=')
    expect(q).toContain('h=6')
  })
})
