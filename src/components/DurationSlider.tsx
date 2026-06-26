interface Props {
  value: number
  onChange: (value: number) => void
}

export default function DurationSlider({ value, onChange }: Props) {
  return (
    <div className="duration-row">
      <label htmlFor="duration">Duration</label>
      <input
        id="duration"
        type="range"
        min={1}
        max={24}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} hours`}
      />
      <span className="duration-val">{value} hrs</span>
    </div>
  )
}
