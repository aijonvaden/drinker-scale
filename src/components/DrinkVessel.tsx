import { useId, type ReactNode } from 'react'

export type VesselType = 'beer' | 'shots' | 'wine' | 'cocktails'

interface Shape {
  outline: ReactNode
  clip: ReactNode
  color: string
}

const SHAPES: Record<VesselType, Shape> = {
  beer: {
    color: '#cf9a36',
    outline: (
      <>
        <rect x="9" y="12" width="26" height="44" rx="3" />
        <path d="M35 20h5a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-5" />
        <path d="M13 22c2-1.5 4-1.5 6 0M22 22c2-1.5 4-1.5 6 0" opacity="0.5" />
      </>
    ),
    clip: <rect x="11" y="15" width="22" height="39" rx="2" />,
  },
  shots: {
    color: '#e6d4a0',
    outline: <path d="M15 16h18l-2 40H17z" />,
    clip: <path d="M16.6 18.4h14.8l-1.7 35.2H18.3z" />,
  },
  wine: {
    color: '#8a2230',
    outline: (
      <>
        <path d="M14 12h20c0 13-4 19-10 19s-10-6-10-19z" />
        <path d="M24 31v20" />
        <path d="M17 53h14" />
      </>
    ),
    clip: <path d="M16 14h16c0 10.5-3.5 16-8 16s-8-5.5-8-16z" />,
  },
  cocktails: {
    color: '#3f8f86',
    outline: (
      <>
        <path d="M9 13h30L24 34z" />
        <path d="M24 34v18" />
        <path d="M16 54h16" />
        <path d="M33 9l-3 5" opacity="0.6" />
        <circle cx="33" cy="8" r="1.4" />
      </>
    ),
    clip: <path d="M13 15.5h22L24 31z" />,
  },
}

interface Props {
  type: VesselType
  /** 0–1 fill fraction. */
  fill: number
  size?: number
}

/** A decorative glass whose liquid rises with the fill fraction. */
export default function DrinkVessel({ type, fill, size = 56 }: Props) {
  const uid = useId().replace(/:/g, '')
  const clipId = `vclip-${uid}`
  const shape = SHAPES[type]
  const f = Math.max(0, Math.min(1, fill))

  return (
    <svg
      className="vessel"
      width={size}
      height={size * (64 / 48)}
      viewBox="0 0 48 64"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>{shape.clip}</clipPath>
      </defs>
      <rect
        x="0"
        y="0"
        width="48"
        height="64"
        fill={shape.color}
        clipPath={`url(#${clipId})`}
        style={{
          transformOrigin: '24px 54px',
          transform: `scaleY(${f})`,
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <g fill="none" stroke="var(--gold-light)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {shape.outline}
      </g>
    </svg>
  )
}
