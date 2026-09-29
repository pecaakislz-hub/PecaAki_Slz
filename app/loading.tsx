import { CarFront, Gauge } from 'lucide-react'

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16" aria-label="Carregando PeçaAki">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-200/70 bg-white/90 p-8 text-center shadow-xl shadow-amber-950/10 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/30">
        <div className="absolute inset-x-0 bottom-14 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <div className="loading-road" aria-hidden="true" />
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 shadow-lg shadow-amber-500/20 dark:bg-slate-800">
          <CarFront className="loading-car h-11 w-11 text-amber-400" strokeWidth={1.7} />
          <span className="loading-light absolute -left-3 top-7 h-1 w-4 rounded-full bg-amber-300/80" />
          <span className="loading-light loading-light-delay absolute -left-6 top-12 h-1 w-7 rounded-full bg-orange-300/70" />
        </div>
        <div className="flex items-center justify-center gap-2 text-lg font-black text-slate-900 dark:text-white">
          Peça<span className="text-amber-500">Aki</span>
          <Gauge className="h-4 w-4 text-amber-500" />
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Preparando seu espaço de auto e moto...</p>
      </div>
    </main>
  )
}
