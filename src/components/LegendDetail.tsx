import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Legend, LegendKind } from '../lib/types'
import { accentForPercentile } from '../lib/emblem'
import { legendRank } from '../lib/units'
import { LEGENDS } from '../data/legends'
import LegendEmblem from './emblems/LegendEmblem'

const KIND_LABEL: Record<LegendKind, string> = {
  real: 'Real',
  fictional: 'Fictional',
  mythological: 'Myth & Legend',
  archetype: 'Archetype',
}

export default function LegendDetail({ legend, onClose }: { legend: Legend; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const accent = accentForPercentile(legend.percentile)
  const rank = legendRank(legend)
  const total = LEGENDS.length
  const top = Math.round((100 - legend.percentile) * 10) / 10

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal legend-detail"
        role="dialog"
        aria-modal="true"
        aria-label={legend.name}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <LegendEmblem
          name={legend.name}
          motifId={legend.motif}
          accent={accent}
          rimText={`№ ${rank} of ${total}`}
          size={176}
        />
        <h2 className="legend-name">{legend.name}</h2>
        <p className="legend-era">{legend.era}</p>
        <div className="detail-tags">
          <span className="tag" style={{ borderColor: accent, color: accent }}>
            {KIND_LABEL[legend.kind]}
          </span>
          <span className="tag">Top {top}%</span>
          <span className="tag">
            Rank № {rank} / {total}
          </span>
        </div>
        <div className="rule" style={{ maxWidth: 200, margin: '4px auto 22px' }} />
        <p className="verdict-text">{legend.verdict}</p>
        <div className="did-you-know">
          <span className="dyk-label">— Did You Know —</span>
          <p className="dyk-text">{legend.fact}</p>
        </div>
      </motion.div>
    </div>
  )
}
