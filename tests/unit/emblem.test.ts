import { describe, it, expect } from 'vitest'
import { initials, bandIndex, accentForPercentile, BANDS } from '../../src/lib/emblem'

describe('initials', () => {
  it('derives monograms, skipping stopwords', () => {
    expect(initials('André the Giant')).toBe('AG')
    expect(initials('James Bond')).toBe('JB')
    expect(initials('The Dude')).toBe('DU')
    expect(initials('E.T.')).toBe('ET')
    expect(initials('Nick & Nora Charles')).toBe('NN')
    expect(initials('Henri de Toulouse-Lautrec')).toBe('HT')
  })

  it('never returns empty', () => {
    expect(initials('').length).toBeGreaterThan(0)
    expect(initials('the of and').length).toBeGreaterThan(0)
  })
})

describe('accent bands', () => {
  it('grades cool -> warm by percentile', () => {
    expect(bandIndex(0)).toBe(0)
    expect(bandIndex(50)).toBe(3)
    expect(bandIndex(99.9)).toBe(6)
    expect(accentForPercentile(0)).toBe(BANDS[0])
    expect(accentForPercentile(99.9)).toBe(BANDS[6])
  })

  it('is monotonic in percentile', () => {
    let prev = -1
    for (let p = 0; p <= 100; p += 1) {
      const idx = bandIndex(p)
      expect(idx).toBeGreaterThanOrEqual(prev)
      prev = idx
    }
  })
})
