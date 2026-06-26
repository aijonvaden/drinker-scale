import { describe, it, expect } from 'vitest'
import {
  totalUnits,
  totalDrinks,
  findLegend,
  andreDistance,
  legendRank,
  ANDRE_UNITS,
} from '../../src/lib/units'
import { LEGENDS } from '../../src/data/legends'

describe('unit math', () => {
  it('weights drinks per the calibration', () => {
    expect(totalUnits({ beers: 1, shots: 1, wine: 1, cocktails: 1 })).toBeCloseTo(7.2)
    expect(totalUnits({ beers: 10, shots: 0, wine: 0, cocktails: 0 })).toBeCloseTo(23)
    expect(totalUnits({ beers: 0, shots: 0, wine: 0, cocktails: 0 })).toBe(0)
  })

  it('counts total drinks', () => {
    expect(totalDrinks({ beers: 2, shots: 3, wine: 1, cocktails: 4 })).toBe(10)
  })
})

describe('findLegend', () => {
  it('maps 0 units to Betty Ford and huge totals to André', () => {
    expect(findLegend(0).id).toBe('betty-ford')
    expect(findLegend(99999).id).toBe('andre')
    expect(findLegend(-5).id).toBe('betty-ford')
  })

  it('10 beers (23 units) lands on Rick Blaine', () => {
    const units = totalUnits({ beers: 10, shots: 0, wine: 0, cocktails: 0 })
    expect(findLegend(units).id).toBe('rick-blaine')
  })

  it('each legend matches its own lower bound', () => {
    for (const l of LEGENDS) {
      expect(findLegend(l.minUnits).id, l.id).toBe(l.id)
    }
  })
})

describe('legendRank', () => {
  it('ranks André first and Betty Ford last', () => {
    const andre = LEGENDS.find((l) => l.id === 'andre')!
    const betty = LEGENDS.find((l) => l.id === 'betty-ford')!
    expect(legendRank(andre)).toBe(1)
    expect(legendRank(betty)).toBe(LEGENDS.length)
  })
})

describe('andreDistance', () => {
  it('is null once you reach André', () => {
    expect(andreDistance(ANDRE_UNITS)).toBeNull()
    expect(andreDistance(ANDRE_UNITS + 50)).toBeNull()
  })

  it('reports the gap from zero', () => {
    const d = andreDistance(0)
    expect(d).not.toBeNull()
    expect(d!.gap).toBe(360)
    expect(d!.beersEquiv).toBe(Math.round(360 / 2.3))
    expect(typeof d!.commentary).toBe('string')
  })
})
