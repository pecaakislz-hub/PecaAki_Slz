'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startedAt = performance.now()
    const duration = 2200
    let frame = 0
    const tick = (now: number) => {
      const value = Math.min(100, Math.round(((now - startedAt) / duration) * 100))
      setProgress(value)
      if (value < 100) frame = window.requestAnimationFrame(tick)
      else onComplete?.()
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [onComplete])

  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 text-white" aria-label="Apresentação PeçaAki" aria-live="polite">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_38%),linear-gradient(135deg,#020617,#111827_55%,#1e293b)]" aria-hidden="true" />
      <section className="relative w-full max-w-sm text-center">
        <div className="mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <img src="/Logo_animado-SF.gif" alt="Logo PeçaAki em animação" className="h-full w-full object-contain drop-shadow-[0_0_32px_rgba(245,158,11,0.28)]" />
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">Peça<span className="text-amber-400">Aki</span></h1>
        <p className="mt-2 text-xs font-medium text-slate-300">Conectando você às melhores soluções automotivas</p>
        <div className="mt-8" role="progressbar" aria-label="Carregando PeçaAki" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-amber-300"><span>Preparando seu espaço</span><span>{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.75)] transition-[width] duration-100 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>
    </main>
  )
}
