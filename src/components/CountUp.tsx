import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Props {
  to: number
  duration?: number
  decimals?: number
  className?: string
}

/** Eased count-up from 0 to `to`; jumps straight to the value under reduced motion. */
export default function CountUp({ to, duration = 1100, decimals = 0, className }: Props) {
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (reduce) {
      setVal(to)
      return
    }
    let start: number | undefined
    const tick = (t: number) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [to, duration, reduce])

  const factor = Math.pow(10, decimals)
  const shown = Math.round(val * factor) / factor
  return <span className={className}>{decimals ? shown.toFixed(decimals) : Math.round(shown)}</span>
}
