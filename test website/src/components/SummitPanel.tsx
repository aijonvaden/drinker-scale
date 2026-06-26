import { useEffect, useState } from 'react'
import { ANDRE_FACTS } from '../data/andreFacts'

const STATS = [
  ['7′4″', 'Height'],
  ['520 lbs', 'Weight'],
  ['100–156', 'Beers / Sitting'],
  ['~360', 'Units / Session'],
]

export default function SummitPanel({ onOpenAndre }: { onOpenAndre?: () => void }) {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t = window.setInterval(() => {
      setFading(true)
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % ANDRE_FACTS.length)
        setFading(false)
      }, 400)
    }, 13000)
    return () => window.clearInterval(t)
  }, [])

  return (
    <section className="summit-panel" aria-label="The Summit: André the Giant">
      <span className="summit-eyebrow">— The Summit —</span>
      <h2 className="summit-name">André the Giant</h2>
      <span className="summit-sub">Eighth Wonder of the World&nbsp;&nbsp;·&nbsp;&nbsp;1946–1993</span>
      <div className="summit-stats">
        {STATS.map(([v, l]) => (
          <div className="summit-stat" key={l}>
            <span className="summit-stat-val">{v}</span>
            <span className="summit-stat-lbl">{l}</span>
          </div>
        ))}
      </div>
      <p className="summit-quote">
        The standard against which all others are measured. What is your excuse? There is none. He is
        simply a wonder of the world.
      </p>
      <p className={`summit-fact${fading ? ' fading' : ''}`}>{ANDRE_FACTS[idx]}</p>
      {onOpenAndre && (
        <button className="ghost-link summit-link" onClick={onOpenAndre}>
          Read André's full record →
        </button>
      )}
    </section>
  )
}
