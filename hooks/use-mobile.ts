// Custom hook to detect mobile viewport width (< 768px).
// Uses useSyncExternalStore for tear-free subscription to window resize and matchMedia.
import * as React from "react"

const MOBILE_BREAKPOINT = 768

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  window.addEventListener("resize", callback)
  return () => {
    mql.removeEventListener("change", callback)
    window.removeEventListener("resize", callback)
  }
}

const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
