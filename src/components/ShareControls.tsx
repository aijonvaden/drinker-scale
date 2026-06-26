import { useState, type RefObject } from 'react'
import { toPng } from 'html-to-image'
import type { DrinkInput, Legend } from '../lib/types'
import { buildShareUrl } from '../lib/shareState'

interface Props {
  input: DrinkInput
  legend: Legend
  cardRef: RefObject<HTMLDivElement | null>
}

type Status = '' | 'rendering' | 'copied' | 'downloaded' | 'error'

export default function ShareControls({ input, legend, cardRef }: Props) {
  const [status, setStatus] = useState<Status>('')
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const flash = (s: Status) => {
    setStatus(s)
    window.setTimeout(() => setStatus(''), 2200)
  }

  const render = async (): Promise<string | null> => {
    const node = cardRef.current
    if (!node) return null
    setStatus('rendering')
    try {
      return await toPng(node, { pixelRatio: 1, cacheBust: true, backgroundColor: '#140d05' })
    } catch {
      flash('error')
      return null
    }
  }

  const download = async () => {
    const dataUrl = await render()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `drinking-legend-${legend.id}.png`
    a.click()
    flash('downloaded')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(input))
      flash('copied')
    } catch {
      flash('error')
    }
  }

  const nativeShare = async () => {
    const dataUrl = await render()
    if (!dataUrl) return
    try {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `drinking-legend-${legend.id}.png`, { type: 'image/png' })
      const data: ShareData = { title: 'The Legendary Drinker Scale', text: `My drinking legend is ${legend.name}.` }
      if (navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file]
      else data.url = buildShareUrl(input)
      await navigator.share(data)
      setStatus('')
    } catch {
      /* user cancelled or unsupported — no-op */
      setStatus('')
    }
  }

  const message: Record<Status, string> = {
    '': 'Save your verdict or send it to a worthy rival.',
    rendering: 'Engraving your card…',
    copied: 'Link copied to clipboard.',
    downloaded: 'Card saved.',
    error: 'Something went wrong — try again.',
  }

  return (
    <div className="share-controls">
      <div className="share-buttons">
        <button type="button" className="share-btn" onClick={download} disabled={status === 'rendering'}>
          ⤓ &nbsp;Download Card
        </button>
        <button type="button" className="share-btn" onClick={copyLink}>
          ⎘ &nbsp;Copy Link
        </button>
        {canShare && (
          <button type="button" className="share-btn" onClick={nativeShare} disabled={status === 'rendering'}>
            ↗ &nbsp;Share
          </button>
        )}
      </div>
      <p className="share-status" aria-live="polite">
        {message[status]}
      </p>
    </div>
  )
}
