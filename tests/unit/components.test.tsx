import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import DrinkStepper from '../../src/components/DrinkStepper'
import App from '../../src/App'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('DrinkStepper', () => {
  it('increments via the + button and disables − at zero', () => {
    const onChange = vi.fn()
    render(
      <DrinkStepper type="beer" label="Beers" sublabel="" unit="cans" max={200} value={0} onChange={onChange} />,
    )
    expect(screen.getByLabelText('Remove one Beers')).toBeDisabled()
    fireEvent.click(screen.getByLabelText('Add one Beers'))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('accepts direct numeric entry and clamps to max', () => {
    const onChange = vi.fn()
    render(
      <DrinkStepper type="wine" label="Wine" sublabel="" unit="glasses" max={100} value={0} onChange={onChange} />,
    )
    fireEvent.change(screen.getByLabelText('Wine'), { target: { value: '500' } })
    expect(onChange).toHaveBeenCalledWith(100)
  })
})

describe('App flow', () => {
  it('renders the matched legend, then resets', async () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Beers'), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: /Render Verdict/i }))

    // Scope to the visible heading — the offscreen ShareCard also carries the name.
    expect(await screen.findByRole('heading', { name: 'Rick Blaine' })).toBeInTheDocument()
    expect(screen.getByText(/Did You Know/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Confess Again/i }))
    expect(await screen.findByText(/Log Your Evening/i)).toBeInTheDocument()
  })

  it('reproduces a result from a deep-link URL', async () => {
    window.history.replaceState(null, '', '/?b=10&h=4')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Rick Blaine' })).toBeInTheDocument()
  })

  it('opens the Hall of Legends and drills into a detail', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Enter the Hall of Legends/i }))
    expect(await screen.findByText(/Immortals of Intake/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Homer Simpson/i }))
    // Two dialogs can coexist (Hall + detail) — scope by the detail's aria-label.
    const dialog = await screen.findByRole('dialog', { name: 'Homer Simpson' })
    expect(within(dialog).getByRole('heading', { name: 'Homer Simpson' })).toBeInTheDocument()
  })
})
