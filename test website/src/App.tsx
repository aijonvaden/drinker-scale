import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DrinkInput, Legend } from './lib/types'
import { EMPTY_INPUT, findLegend, totalUnits } from './lib/units'
import { decodeState, encodeState } from './lib/shareState'
import { LEGENDS } from './data/legends'
import Header from './components/Header'
import Footer from './components/Footer'
import Calculator from './components/Calculator'
import SummitPanel from './components/SummitPanel'
import ResultCard from './components/ResultCard'
import HallOfLegends from './components/HallOfLegends'
import LegendDetail from './components/LegendDetail'

export default function App() {
  const initial = useMemo(
    () => (typeof location !== 'undefined' ? decodeState(location.search) : null),
    [],
  )
  const [input, setInput] = useState<DrinkInput>(initial ?? EMPTY_INPUT)
  const [result, setResult] = useState<Legend | null>(
    initial ? findLegend(totalUnits(initial)) : null,
  )
  const [hallOpen, setHallOpen] = useState(false)
  const [detail, setDetail] = useState<Legend | null>(null)

  const syncUrl = (d: DrinkInput | null) => {
    if (typeof history === 'undefined') return
    const url = d ? `${location.pathname}?${encodeState(d)}` : location.pathname
    history.replaceState(null, '', url)
  }

  const submit = () => {
    if (totalUnits(input) === 0) return
    setResult(findLegend(totalUnits(input)))
    syncUrl(input)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setResult(null)
    setInput(EMPTY_INPUT)
    syncUrl(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openAndre = () => {
    const andre = LEGENDS.find((l) => l.id === 'andre')
    if (andre) setDetail(andre)
  }

  return (
    <>
      <div className="atmosphere" aria-hidden="true" />
      <div className="page-wrap">
        <Header onOpenHall={() => setHallOpen(true)} />

        <AnimatePresence mode="wait" initial={false}>
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultCard legend={result} input={input} onReset={reset} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Calculator input={input} onChange={setInput} onSubmit={submit} />
              <SummitPanel onOpenAndre={openAndre} />
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>

      <AnimatePresence>
        {hallOpen && (
          <HallOfLegends
            onClose={() => setHallOpen(false)}
            onSelect={(l) => setDetail(l)}
            currentId={result?.id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{detail && <LegendDetail legend={detail} onClose={() => setDetail(null)} />}</AnimatePresence>
    </>
  )
}
