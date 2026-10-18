'use client'

import { useCallback, useEffect, useState } from 'react'
import SplashScreen from './SplashScreen'

const SPLASH_KEY = 'pecaaki:splash-seen'

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SPLASH_KEY) === '1') setVisible(false)
    } catch {
      // Se o storage estiver indisponível, a apresentação continua normalmente.
    }
  }, [])

  const complete = useCallback(() => {
    try { window.sessionStorage.setItem(SPLASH_KEY, '1') } catch { /* no-op */ }
    setVisible(false)
  }, [])

  return visible ? <SplashScreen onComplete={complete} /> : <>{children}</>
}
