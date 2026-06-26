import { useId } from 'react'
import { initials } from '../../lib/emblem'
import { motif } from './motifs'

interface Props {
  name: string
  motifId: string
  accent: string
  /** Small text struck into the bottom rim, e.g. "№ 12" or "1946–1993". */
  rimText?: string
  /** Pixel size of the rendered coin. */
  size?: number
  className?: string
  /** Set false to hide the curved name on the top rim (e.g. tiny chips). */
  showName?: boolean
}

const C = 110 // center
const R_TOP = 90 // text radius (top arc)
const R_BOT = 90 // text radius (bottom arc)

/**
 * A parametric "struck coin" emblem: gilt frame, beaded ring, curved name on the
 * top rim, a small motif, a large engraved monogram, and rim text below. The
 * accent colour grades the rings per tier so the whole roster reads as a series.
 */
export default function LegendEmblem({
  name,
  motifId,
  accent,
  rimText,
  size = 200,
  className,
  showName = true,
}: Props) {
  const raw = useId()
  const uid = raw.replace(/:/g, '')
  const gilt = `gilt-${uid}`
  const face = `face-${uid}`
  const topArc = `topArc-${uid}`
  const botArc = `botArc-${uid}`

  const mono = initials(name)
  const monoSize = mono.length >= 2 ? 58 : 70
  const nameSize = name.length > 18 ? 9.5 : name.length > 12 ? 11 : 12.5

  const beads = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2
    return { x: C + Math.cos(a) * 99, y: C + Math.sin(a) * 99 }
  })

  return (
    <svg
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${name} emblem`}
    >
      <defs>
        <radialGradient id={face} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#241a0c" />
          <stop offset="70%" stopColor="#160f06" />
          <stop offset="100%" stopColor="#0d0904" />
        </radialGradient>
        <linearGradient id={gilt} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d784" />
          <stop offset="45%" stopColor={accent} />
          <stop offset="100%" stopColor="#7c5e22" />
        </linearGradient>
        <path id={topArc} fill="none" d={`M ${C - R_TOP} ${C} A ${R_TOP} ${R_TOP} 0 0 1 ${C + R_TOP} ${C}`} />
        <path id={botArc} fill="none" d={`M ${C + R_BOT} ${C} A ${R_BOT} ${R_BOT} 0 0 1 ${C - R_BOT} ${C}`} />
      </defs>

      {/* Coin body */}
      <circle cx={C} cy={C} r="104" fill={`url(#${face})`} stroke={`url(#${gilt})`} strokeWidth="3" />
      <circle cx={C} cy={C} r="104" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
      <circle cx={C} cy={C} r="92" fill="none" stroke={`url(#${gilt})`} strokeWidth="1.4" strokeOpacity="0.8" />
      <circle cx={C} cy={C} r="70" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.45" />

      {/* Beaded inner ring */}
      <g fill={`url(#${gilt})`} opacity="0.7">
        {beads.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r="0.9" />
        ))}
      </g>

      {/* Cardinal fleurons */}
      <g fill={`url(#${gilt})`} opacity="0.9">
        <path d={`M ${C} 12 l 4 5 -4 5 -4 -5 z`} />
        <path d={`M ${C} 208 l 4 -5 -4 -5 -4 5 z`} />
        <path d={`M 12 ${C} l 5 4 5 -4 -5 -4 z`} />
        <path d={`M 208 ${C} l -5 4 -5 -4 5 -4 z`} />
      </g>

      {/* Curved name on the top rim */}
      {showName && (
        <text
          fill="#f3ecd9"
          fontFamily="'Playfair Display', serif"
          fontSize={nameSize}
          fontWeight={700}
          letterSpacing="2"
          style={{ textTransform: 'uppercase' }}
        >
          <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">
            {name}
          </textPath>
        </text>
      )}

      {/* Rim text on the bottom */}
      {rimText && (
        <text
          fill={accent}
          fontFamily="'Courier Prime', monospace"
          fontSize="9"
          letterSpacing="2.5"
          style={{ textTransform: 'uppercase' }}
        >
          <textPath href={`#${botArc}`} startOffset="50%" textAnchor="middle">
            {rimText}
          </textPath>
        </text>
      )}

      {/* Motif */}
      <g style={{ color: accent }}>
        <svg x={C - 15} y="50" width="30" height="30" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {motif(motifId)}
          </g>
        </svg>
      </g>

      {/* Engraved monogram */}
      <text
        x={C}
        y={C + 34}
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontWeight={900}
        fontStyle="italic"
        fontSize={monoSize}
        fill={`url(#${gilt})`}
      >
        {mono}
      </text>

      {/* Laurel flourish under monogram */}
      <path
        d={`M ${C - 22} ${C + 50} q 22 12 44 0`}
        fill="none"
        stroke={`url(#${gilt})`}
        strokeWidth="1.2"
        opacity="0.7"
      />
    </svg>
  )
}
