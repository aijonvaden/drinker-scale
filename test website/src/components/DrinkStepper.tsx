import { useId } from 'react'
import DrinkVessel, { type VesselType } from './DrinkVessel'

interface Props {
  type: VesselType
  label: string
  sublabel: string
  unit: string
  value: number
  max: number
  /** Value that visually fills the glass. */
  fillAt?: number
  onChange: (value: number) => void
}

export default function DrinkStepper({
  type,
  label,
  sublabel,
  unit,
  value,
  max,
  fillAt = 10,
  onChange,
}: Props) {
  const id = useId()
  const clamp = (n: number) => Math.max(0, Math.min(max, Math.round(n) || 0))
  const set = (n: number) => onChange(clamp(n))

  return (
    <div className="drink-field">
      <label htmlFor={id}>{label}</label>
      <span className="sublabel">{sublabel}</span>
      <div className="stepper">
        <button
          type="button"
          className="step-btn"
          aria-label={`Remove one ${label}`}
          onClick={() => set(value - 1)}
          disabled={value <= 0}
        >
          −
        </button>
        <div className="vessel-wrap">
          <DrinkVessel type={type} fill={value / fillAt} />
          <input
            id={id}
            className="vessel-input"
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            value={value}
            onChange={(e) => set(Number(e.target.value))}
            aria-describedby={`${id}-unit`}
          />
        </div>
        <button
          type="button"
          className="step-btn"
          aria-label={`Add one ${label}`}
          onClick={() => set(value + 1)}
          disabled={value >= max}
        >
          +
        </button>
      </div>
      <span className="step-unit" id={`${id}-unit`}>
        {unit}
      </span>
    </div>
  )
}
