'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0)
  const [imageReady, setImageReady] = useState(false)
  const readyAt = useRef<number | null>(null)

  const markImageReady = useCallback(() => {
    setImageReady((current) => {
      if (current) return current
      readyAt.current = performance.now()
      return true
    })
  }, [])

  // Alguns navegadores/PWAs podem não disparar onLoad novamente para um GIF em cache.
  // O fallback mantém a animação visual, mas garante que a abertura nunca fique presa em 86%.
  useEffect(() => {
    if (imageReady) return
    const fallback = window.setTimeout(markImageReady, 1400)
    return () => window.clearTimeout(fallback)
  }, [imageReady, markImageReady])

  useEffect(() => {
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const loadingProgress = Math.min(86, Math.round(((now - startedAt) / 900) * 86))
      const completionProgress = readyAt.current ? 86 + Math.min(14, Math.round(((now - readyAt.current) / 220) * 14)) : 0
      const value = imageReady ? Math.max(86, completionProgress) : loadingProgress
      setProgress(value)
      if (value < 100) frame = window.requestAnimationFrame(tick)
      else onComplete?.()
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [imageReady, onComplete])

  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 text-slate-900" aria-label="Apresentação PeçaAki Slz" aria-live="polite">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.12),transparent_36%),linear-gradient(145deg,#ffffff,#fffaf0_58%,#f8fafc)]" aria-hidden="true" />
      <section className="relative w-full max-w-sm text-center">
        <div className="mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <img src="/Logo_animado-SF-optimized.gif" alt="Logo PeçaAki Slz em animação" width="360" height="360" loading="eager" decoding="async" onLoad={markImageReady} onError={markImageReady} className="h-full w-full object-contain drop-shadow-[0_10px_22px_rgba(100,116,139,0.22)]" />
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">PeçaAki <span className="text-amber-600">Slz</span></h1>
        <p className="mt-2 text-xs font-medium text-slate-600">Conectando você às melhores soluções automotivas</p>
        <div className="mt-8" role="progressbar" aria-label="Carregando PeçaAki Slz" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-amber-700"><span>Preparando seu espaço</span><span>{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-300/70">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.45)] transition-[width] duration-100 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>
    </main>
  )
}
