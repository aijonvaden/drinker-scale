import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LEGENDS } from '../data/legends'
import type { Legend } from '../lib/types'
import { accentForPercentile } from '../lib/emblem'
import { legendRank } from '../lib/units'
import LegendEmblem from './emblems/LegendEmblem'

interface Props {
  onClose: () => void
  onSelect: (legend: Legend) => void
  currentId?: string
}

export default function HallOfLegends({ onClose, onSelect, currentId }: Props) {
  const [q, setQ] = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return qq
      ? LEGENDS.filter((l) => l.name.toLowerCase().includes(qq) || l.era.toLowerCase().includes(qq))
      : LEGENDS
  }, [q])

  return (
    <div className="hall-overlay" role="dialog" aria-modal="true" aria-label="The Hall of Legends">
      <div className="hall-inner">
        <div className="hall-head">
          <button className="modal-close" aria-label="Close the Hall" onClick={onClose}>
            ×
          </button>
          <p className="masthead-label">— The Hall of Legends —</p>
          <h2 className="hall-title">Ninety-Six Immortals of Intake</h2>
          <p className="hall-sub">
            From the soberly sensible to the wonder of the world. Tap any name for the full record.
          </p>
          <div className="hall-controls">
            <input
              className="hall-search"
              type="search"
              placeholder="Search a legend…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search legends"
            />
          </div>
        </div>

        {list.length === 0 ? (
          <p className="hall-empty">No legends answer to that name.</p>
        ) : (
          <ul className="hall-grid">
            {list.map((l, i) => {
              const accent = accentForPercentile(l.percentile)
              const rank = legendRank(l)
              const top = Math.round((100 - l.percentile) * 10) / 10
              return (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1], delay: Math.min(i * 0.008, 0.45) }}
                >
                  <button
                    className={`hall-card${l.id === currentId ? ' is-current' : ''}`}
                    style={{ borderColor: `${accent}55` }}
                    onClick={() => onSelect(l)}
                  >
                    <span className="hall-rank" style={{ color: accent }}>
                      № {rank}
                    </span>
                    <LegendEmblem name={l.name} motifId={l.motif} accent={accent} size={96} showName={false} />
                    <span className="hall-name">{l.name}</span>
                    <span className="hall-era">{l.era}</span>
                    <span className="hall-pct">Top {top}%</span>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
