import { useRef } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { DrinkInput, Legend } from '../lib/types'
import { legendRank, totalDrinks, totalUnits } from '../lib/units'
import { LEGENDS } from '../data/legends'
import { accentForPercentile } from '../lib/emblem'
import LegendEmblem from './emblems/LegendEmblem'
import CountUp from './CountUp'
import AndreDistance from './AndreDistance'
import PercentileBar from './PercentileBar'
import ShareCard from './ShareCard'
import ShareControls from './ShareControls'

interface Props {
  legend: Legend
  input: DrinkInput
  onReset: () => void
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function ResultCard({ legend, input, onReset }: Props) {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const units = totalUnits(input)
  const drinks = totalDrinks(input)
  const perHour = Number((units / input.duration).toFixed(1))
  const rank = legendRank(legend)
  const total = LEGENDS.length
  const accent = accentForPercentile(legend.percentile)

  return (
    <div id="result">
      <motion.div
        className="result-card"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        <motion.p className="verdict-label" variants={item}>
          — Your Legend Equivalent —
        </motion.p>

        <motion.div
          className="emblem-strike"
          initial={reduce ? false : { scale: 0.55, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 13, delay: 0.15 }}
        >
          <LegendEmblem
            name={legend.name}
            motifId={legend.motif}
            accent={accent}
            rimText={`№ ${rank} of ${total}`}
            size={210}
          />
        </motion.div>

        <motion.h2 className="legend-name" variants={item}>
          {legend.name}
        </motion.h2>
        <motion.p className="legend-era" variants={item}>
          {legend.era}
        </motion.p>

        <motion.div className="rule" style={{ maxWidth: 200, margin: '0 auto 24px' }} variants={item} />

        <motion.p className="verdict-text" variants={item}>
          {legend.verdict}
        </motion.p>

        <motion.div className="did-you-know" variants={item}>
          <span className="dyk-label">— Did You Know —</span>
          <p className="dyk-text">{legend.fact}</p>
        </motion.div>

        <motion.div className="stats-strip" variants={item}>
          <div className="stat">
            <span className="stat-val">
              <CountUp to={drinks} />
            </span>
            <span className="stat-lbl">Drinks</span>
          </div>
          <div className="stat">
            <span className="stat-val">
              <CountUp to={Math.round(units)} />
            </span>
            <span className="stat-lbl">Units</span>
          </div>
          <div className="stat">
            <span className="stat-val">
              <CountUp to={perHour} decimals={1} />
            </span>
            <span className="stat-lbl">Per Hour</span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <AndreDistance units={units} />
        </motion.div>

        <motion.div variants={item}>
          <PercentileBar percentile={legend.percentile} />
        </motion.div>

        <motion.div variants={item}>
          <ShareControls input={input} legend={legend} cardRef={cardRef} />
        </motion.div>

        <motion.button className="try-again" onClick={onReset} variants={item}>
          ◂ &nbsp;Confess Again
        </motion.button>
      </motion.div>

      <ShareCard ref={cardRef} legend={legend} units={units} drinks={drinks} rank={rank} total={total} />
    </div>
  )
}
