import { andreDistance } from '../lib/units'

export default function AndreDistance({ units }: { units: number }) {
  const d = andreDistance(units)

  if (!d) {
    return (
      <div className="andre-distance">
        <span className="andre-distance-icon" aria-hidden="true">
          🏔️
        </span>
        <p className="andre-distance-text">
          <strong>You have reached André.</strong> There is no one above you on this scale. The air is
          thin up here, and the view is yours alone.
        </p>
      </div>
    )
  }

  return (
    <div className="andre-distance">
      <span className="andre-distance-icon" aria-hidden="true">
        🏔️
      </span>
      <p className="andre-distance-text">
        <strong>{d.gap} units from André.</strong> That is approximately <strong>{d.beersEquiv} beers</strong>{' '}
        short of his documented record. {d.commentary}
      </p>
    </div>
  )
}
