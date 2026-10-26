'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, CreditCard, Gauge, ShieldCheck, Sparkles, Store, Wallet } from 'lucide-react'

const cards = [
  { code: 'STARTER', title: 'Starter', eyebrow: 'Gratuito', price: 'R$ 0', color: 'slate', features: ['Até 5 cotações respondidas por mês', 'Acesso às solicitações da Grande São Luís', 'Ativado automaticamente no cadastro'], cta: 'Plano atual' },
  { code: 'PRO', title: 'Pro', eyebrow: 'Profissional', price: 'R$ 50', annual: 'R$ 500/ano', color: 'amber', popular: true, features: ['Até 50 cotações respondidas por mês', 'Selo de Lojista Verificado', 'Créditos extras por R$ 2,50 cada'], cta: 'Contratar Plano Pro' },
  { code: 'PREMIUM', title: 'Premium', eyebrow: 'Atacado / grande fluxo', price: 'R$ 100', annual: 'R$ 1.000/ano', color: 'violet', features: ['Até 100 cotações respondidas por mês', 'Destaque Ouro na exibição ao comprador', 'Créditos extras por R$ 2,50 cada'], cta: 'Contratar Plano Premium' },
]

export default function PlanosPage() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { fetch('/api/subscriptions/me').then(async (res) => { const data = await res.json(); if (!res.ok) setError(data.error || 'Não foi possível carregar os planos.'); else setOverview(data.overview) }).catch(() => setError('Falha de comunicação com o servidor.')).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="mx-auto max-w-5xl py-20 text-center text-sm text-slate-500">Carregando planos e consumo...</div>
  if (error) return <div className="mx-auto max-w-xl py-20 text-center"><Store className="mx-auto mb-4 h-10 w-10 text-amber-500" /><h1 className="text-xl font-black text-slate-900 dark:text-white">Planos do lojista</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p><Link href="/login" className="mt-5 inline-flex rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-slate-950">Entrar na conta</Link></div>

  return <div className="mx-auto max-w-6xl space-y-6 py-5 pb-12">
    <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-6 text-white shadow-xl sm:p-8"><div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" /><div className="relative"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-amber-300"><Sparkles className="h-4 w-4" /> PeçaAki Slz para lojistas</div><h1 className="mt-3 text-2xl font-black sm:text-4xl">Planos que acompanham o ritmo da sua loja</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Comece no Starter, responda às cotações da Grande São Luís e faça upgrade quando seu fluxo crescer.</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric icon={<Gauge />} label="Cotações do mês" value={`${overview.used}/${overview.available}`} /><Metric icon={<ShieldCheck />} label="Plano atual" value={overview.subscription.planTier} /><Metric icon={<Wallet />} label="Créditos extras" value={String(overview.extraCredits)} /></div></div></header>
    <div className="grid gap-5 lg:grid-cols-3">{cards.map((card) => <article key={card.code} className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm dark:bg-slate-900 ${card.popular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-slate-800'}`}>{card.popular && <span className="absolute -top-3 right-5 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">Mais popular</span>}<p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{card.eyebrow}</p><h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Plano {card.title}</h2><div className="mt-5"><span className="text-4xl font-black text-slate-900 dark:text-white">{card.price}</span><span className="text-sm text-slate-500"> /mês</span>{card.annual && <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">ou {card.annual} — economize</p>}</div><ul className="mt-6 flex-1 space-y-3">{card.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{feature}</li>)}</ul>{card.code === overview.subscription.planTier ? <button disabled className="mt-7 rounded-xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-400 dark:bg-slate-800">Plano atual</button> : <Link href={`/planos/confirmar?plan=${card.code}`} className={`mt-7 rounded-xl px-4 py-3 text-center text-xs font-black transition active:scale-[.98] ${card.popular ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950'}`}>{card.cta}</Link>}</article>)}</div>
    <p className="text-center text-xs text-slate-500 dark:text-slate-400">A ativação de planos pagos ocorre somente após confirmação do pagamento pelo provedor. Nenhuma cobrança é realizada nesta tela.</p>
  </div>
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"><div className="flex items-center gap-2 text-amber-300">{icon}<span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{label}</span></div><strong className="mt-1 block text-lg font-black">{value}</strong></div> }
