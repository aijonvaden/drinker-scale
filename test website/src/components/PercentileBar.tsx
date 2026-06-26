import { motion, useReducedMotion } from 'framer-motion'

export default function PercentileBar({ percentile }: { percentile: number }) {
  const reduce = useReducedMotion()
  const top = Math.round((100 - percentile) * 10) / 10

  return (
    <div className="percentile-bar">
      <div className="bar-label">
        <span>Mortal</span>
        <span>Top {top}% of All Time</span>
        <span>André</span>
      </div>
      <div className="bar-track">
        <motion.div
          className="bar-fill"
          initial={{ width: reduce ? `${percentile}%` : 0 }}
          animate={{ width: `${percentile}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        />
      </div>
    </div>
  )
}
