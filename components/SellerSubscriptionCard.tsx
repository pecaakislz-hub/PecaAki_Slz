'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CreditCard, Gauge, Loader2, Wallet } from 'lucide-react'

export default function SellerSubscriptionCard() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/subscriptions/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return
        const data = await response.json()
        setOverview(data.overview)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900"><Loader2 className="h-4 w-4 animate-spin text-amber-500" /> Carregando assinatura...</div>
  if (!overview) return null

  const percentage = Math.min(100, overview.available > 0 ? Math.round((overview.used / overview.available) * 100) : 0)
  const planName = overview.subscription.planTier === 'PREMIUM' ? 'Premium' : overview.subscription.planTier === 'PRO' ? 'Pro' : 'Starter'

  return <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-slate-50 p-4 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" /><p className="text-[11px] font-black uppercase tracking-[.16em] text-amber-700 dark:text-amber-300">Plano da loja</p><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{planName}</span></div><p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Acompanhe sua cota de respostas e evolua quando sua operação crescer.</p></div><Link href="/planos" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400"><span>Gerenciar plano</span><ArrowRight className="h-4 w-4" /></Link></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]"><div><div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300"><span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-sky-500" /> Cotações do mês</span><span>{overview.used}/{overview.available}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-full rounded-full transition-all ${percentage >= 90 ? 'bg-rose-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }} /></div><p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{overview.remaining} resposta(s) disponível(is)</p></div><div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/50"><p className="text-[10px] text-slate-500">Créditos extras</p><strong className="flex items-center gap-1 text-sm text-slate-900 dark:text-white"><Wallet className="h-3.5 w-3.5 text-amber-500" />{overview.extraCredits}</strong></div><div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/50"><p className="text-[10px] text-slate-500">Limite base</p><strong className="text-sm text-slate-900 dark:text-white">{overview.limit}/mês</strong></div></div></section>
}
