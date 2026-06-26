import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom lacks matchMedia — return matches:true for reduced-motion so framer-motion
// skips animations and tests stay deterministic.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!('ResizeObserver' in window)) {
  ;(window as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO
}
if (!('IntersectionObserver' in window)) {
  ;(window as unknown as { IntersectionObserver: typeof RO }).IntersectionObserver = RO
}
