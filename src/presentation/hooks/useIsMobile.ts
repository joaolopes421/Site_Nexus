import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

function getIsMobileSnapshot(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
}

function subscribeToMobileViewport(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}

  const mediaQuery = window.matchMedia(MOBILE_QUERY)
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }

  mediaQuery.addListener(onChange)
  return () => mediaQuery.removeListener(onChange)
}

/** Observa mudanças no breakpoint mobile sem listeners de resize por componente. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeToMobileViewport, getIsMobileSnapshot, () => false)
}
