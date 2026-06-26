import { describe, it, expect } from 'vitest'
import { LEGENDS } from '../../src/data/legends'
import { hasMotif } from '../../src/components/emblems/motifs'

describe('legend ladder integrity', () => {
  it('has 90+ legends with unique ids', () => {
    expect(LEGENDS.length).toBeGreaterThanOrEqual(90)
    const ids = new Set(LEGENDS.map((l) => l.id))
    expect(ids.size).toBe(LEGENDS.length)
  })

  it('starts at 0 and ends at André with maxUnits = Infinity', () => {
    expect(LEGENDS[0].minUnits).toBe(0)
    const apex = LEGENDS[LEGENDS.length - 1]
    expect(apex.id).toBe('andre')
    expect(apex.maxUnits).toBe(Infinity)
    expect(apex.percentile).toBeCloseTo(99.9)
  })

  it('bands are contiguous with strictly increasing minUnits', () => {
    for (let i = 0; i < LEGENDS.length; i++) {
      const l = LEGENDS[i]
      expect(l.minUnits, l.id).toBeLessThan(l.maxUnits)
      if (i > 0) {
        expect(l.minUnits, `contiguity before ${l.id}`).toBe(LEGENDS[i - 1].maxUnits)
        expect(l.minUnits, `monotonic at ${l.id}`).toBeGreaterThan(LEGENDS[i - 1].minUnits)
      }
    }
  })

  it('percentile is non-decreasing', () => {
    for (let i = 1; i < LEGENDS.length; i++) {
      expect(LEGENDS[i].percentile, LEGENDS[i].id).toBeGreaterThanOrEqual(LEGENDS[i - 1].percentile)
    }
  })

  it('every units value across 0..1000 maps to exactly one legend', () => {
    for (let u = 0; u <= 1000; u += 0.5) {
      const matches = LEGENDS.filter((l) => u >= l.minUnits && u < l.maxUnits)
      expect(matches.length, `units=${u}`).toBe(1)
    }
  })

  it('every legend has a valid kind and an implemented motif', () => {
    const kinds = new Set(['real', 'fictional', 'mythological', 'archetype'])
    for (const l of LEGENDS) {
      expect(kinds.has(l.kind), `${l.id} kind ${l.kind}`).toBe(true)
      expect(hasMotif(l.motif), `${l.id} motif ${l.motif}`).toBe(true)
      expect(l.verdict.length).toBeGreaterThan(40)
      expect(l.fact.length).toBeGreaterThan(40)
    }
  })

  it('contains a healthy mix of new and original legends', () => {
    const ids = LEGENDS.map((l) => l.id)
    expect(ids).toContain('andre')
    expect(ids).toContain('homer-simpson')
    expect(ids).toContain('rick-sanchez')
    expect(ids).toContain('dionysus')
    expect(ids).toContain('betty-ford')
  })
})
