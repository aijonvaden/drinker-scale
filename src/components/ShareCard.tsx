import { forwardRef } from 'react'
import type { Legend } from '../lib/types'
import { accentForPercentile } from '../lib/emblem'
import LegendEmblem from './emblems/LegendEmblem'

interface Props {
  legend: Legend
  units: number
  drinks: number
  rank: number
  total: number
}

function excerpt(verdict: string): string {
  const first = verdict.split('. ')[0]
  const s = first.endsWith('.') ? first : `${first}.`
  return s.length > 200 ? `${s.slice(0, 180).trimEnd()}…` : s
}

const display = "'Playfair Display', Georgia, serif"
const mono = "'Courier Prime', monospace"

/** Off-screen 1080×1350 portrait card, captured to PNG for sharing. */
const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { legend, units, drinks, rank, total },
  ref,
) {
  const accent = accentForPercentile(legend.percentile)
  const top = Math.round((100 - legend.percentile) * 10) / 10

  return (
    <div aria-hidden="true" style={{ position: 'fixed', left: -20000, top: 0, pointerEvents: 'none' }}>
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          boxSizing: 'border-box',
          padding: 64,
          backgroundColor: '#140d05',
          backgroundImage:
            'radial-gradient(ellipse at 50% 18%, rgba(201,168,76,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 120%, rgba(0,0,0,0.6) 0%, transparent 60%)',
          color: '#f5f0e8',
          fontFamily: mono,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: `3px solid ${accent}`,
          outline: '1px solid rgba(201,168,76,0.35)',
          outlineOffset: -14,
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 9, textTransform: 'uppercase', color: '#c9a84c', opacity: 0.85, marginTop: 18 }}>
          The Legendary Drinker Scale
        </div>
        <div style={{ width: 220, height: 1, background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', margin: '26px 0 6px' }} />
        <div style={{ fontSize: 18, letterSpacing: 5, textTransform: 'uppercase', color: '#f5f0e8', opacity: 0.55 }}>
          Your Legend Equivalent
        </div>

        <div style={{ margin: '20px 0 4px' }}>
          <LegendEmblem name={legend.name} motifId={legend.motif} accent={accent} rimText={`№ ${rank} of ${total}`} size={360} />
        </div>

        <div style={{ fontFamily: display, fontWeight: 900, fontStyle: 'italic', fontSize: legend.name.length > 16 ? 64 : 82, lineHeight: 1.05, margin: '6px 30px 0' }}>
          {legend.name}
        </div>
        <div style={{ fontSize: 19, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginTop: 16, padding: '0 40px' }}>
          {legend.era}
        </div>

        <div style={{ fontFamily: display, fontStyle: 'italic', fontSize: 30, lineHeight: 1.6, color: '#f5f0e8', opacity: 0.9, margin: '34px 30px 0', maxWidth: 880 }}>
          “{excerpt(legend.verdict)}”
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            width: 880,
            borderTop: '1px solid rgba(201,168,76,0.3)',
            borderBottom: '1px solid rgba(201,168,76,0.3)',
            padding: '26px 0',
          }}
        >
          {[
            [drinks, 'Drinks'],
            [Math.round(units), 'Units'],
            [`Top ${top}%`, 'Of All Time'],
          ].map(([v, l], i) => (
            <div key={i} style={{ flex: 1, borderRight: i < 2 ? '1px solid rgba(201,168,76,0.18)' : 'none' }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: '#e8c96d', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', color: '#f5f0e8', opacity: 0.5, marginTop: 10 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 20, letterSpacing: 5, textTransform: 'uppercase', color: '#c9a84c', opacity: 0.8, margin: '34px 0 8px' }}>
          Find your legend
        </div>
      </div>
    </div>
  )
})

export default ShareCard
