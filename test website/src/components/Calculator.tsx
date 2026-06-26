import type { DrinkInput } from '../lib/types'
import { totalDrinks, totalUnits } from '../lib/units'
import DrinkStepper from './DrinkStepper'
import DurationSlider from './DurationSlider'
import type { VesselType } from './DrinkVessel'

interface Props {
  input: DrinkInput
  onChange: (next: DrinkInput) => void
  onSubmit: () => void
}

const FIELDS: {
  key: keyof Omit<DrinkInput, 'duration'>
  type: VesselType
  label: string
  sublabel: string
  unit: string
  max: number
  fillAt: number
}[] = [
  { key: 'beers', type: 'beer', label: 'Beers', sublabel: '12 oz / standard pint', unit: 'cans', max: 200, fillAt: 10 },
  { key: 'shots', type: 'shots', label: 'Shots / Spirits', sublabel: '1.5 oz per shot', unit: 'shots', max: 100, fillAt: 8 },
  { key: 'wine', type: 'wine', label: 'Wine', sublabel: '5 oz glass', unit: 'glasses', max: 100, fillAt: 8 },
  { key: 'cocktails', type: 'cocktails', label: 'Cocktails', sublabel: 'mixed drinks, martinis', unit: 'drinks', max: 100, fillAt: 8 },
]

export default function Calculator({ input, onChange, onSubmit }: Props) {
  const units = totalUnits(input)
  const drinks = totalDrinks(input)
  const empty = units === 0

  return (
    <div className="calculator" id="calc-form">
      <p className="section-title">— Log Your Evening's Intake —</p>

      <div className="drink-grid">
        {FIELDS.map((f) => (
          <DrinkStepper
            key={f.key}
            type={f.type}
            label={f.label}
            sublabel={f.sublabel}
            unit={f.unit}
            max={f.max}
            fillAt={f.fillAt}
            value={input[f.key]}
            onChange={(v) => onChange({ ...input, [f.key]: v })}
          />
        ))}
      </div>

      <DurationSlider value={input.duration} onChange={(v) => onChange({ ...input, duration: v })} />

      <div className="tally" aria-live="polite">
        <span className="tally-num">{Math.round(units)}</span>
        <span className="tally-lbl">
          units logged{drinks > 0 ? ` · ${drinks} ${drinks === 1 ? 'drink' : 'drinks'}` : ''}
        </span>
      </div>

      <button className="cta-btn" onClick={onSubmit} disabled={empty}>
        ▸ &nbsp;Render Verdict
      </button>
      {empty && <p className="cta-hint">Log at least one drink to be judged.</p>}
    </div>
  )
}
