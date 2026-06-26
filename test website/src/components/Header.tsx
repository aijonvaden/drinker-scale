interface Props {
  onOpenHall: () => void
}

export default function Header({ onOpenHall }: Props) {
  return (
    <header className="site-header">
      <p className="masthead-label">An Impartial Assessment of Your</p>
      <div className="rule" />
      <h1>Legendary Drinker Scale</h1>
      <p className="subtitle">Where do you rank among history's great consumers?</p>
      <div className="rule-double" />
      <button className="ghost-link" onClick={onOpenHall}>
        ✦ &nbsp;Enter the Hall of Legends&nbsp; ✦
      </button>
    </header>
  )
}
