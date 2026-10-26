'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, CheckCircle2, CreditCard, QrCode, ShieldCheck, Smartphone, Wallet } from 'lucide-react'

type PlanCode = 'PRO' | 'PREMIUM'
type BillingCycle = 'MONTHLY' | 'ANNUALLY'
type PaymentMethod = 'PIX' | 'CREDIT_CARD'

const planDetails: Record<PlanCode, { name: string; monthly: number; annual: number; quota: number; badge: string; badgeClass: string; benefit: string }> = {
  PRO: { name: 'Plano Pro', monthly: 50, annual: 500, quota: 50, badge: 'Profissional', badgeClass: 'bg-amber-500 text-slate-950', benefit: 'Selo de Lojista Verificado' },
  PREMIUM: { name: 'Plano Premium', monthly: 100, annual: 1000, quota: 100, badge: 'Destaque Ouro', badgeClass: 'bg-violet-500 text-white', benefit: 'Prioridade na exibição para o comprador' },
}

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

export default function PlanCheckoutModal({ initialPlan = 'PRO' as PlanCode }: { initialPlan?: PlanCode }) {
  const [plan, setPlan] = useState<PlanCode>(initialPlan)
  const [cycle, setCycle] = useState<BillingCycle>('MONTHLY')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; purchaseId?: string } | null>(null)
  const selected = planDetails[plan]
  const amount = cycle === 'ANNUALLY' ? selected.annual : selected.monthly
  const saving = cycle === 'ANNUALLY' ? selected.monthly * 12 - selected.annual : 0

  const paymentLabel = useMemo(() => paymentMethod === 'PIX' ? 'PIX QR Code' : 'Cartão de Crédito', [paymentMethod])

  const confirmSubscription = async () => {
    setSending(true)
    setResult(null)
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingCycle: cycle, paymentMethod, simulateApproval: true }),
      })
      const data = await response.json()
      setResult({ success: response.ok, message: data.message || data.error || 'Não foi possível concluir a contratação.', purchaseId: data.purchaseId })
    } catch {
      setResult({ success: false, message: 'Falha de comunicação. Tente novamente.' })
    } finally {
      setSending(false)
    }
  }

  if (result?.success) return <div className="mx-auto max-w-xl py-5 pb-12"><section className="rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-xl dark:border-emerald-900/60 dark:bg-slate-900 sm:p-8"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"><CheckCircle2 className="h-9 w-9" /></div><p className="mt-5 text-[11px] font-black uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">Assinatura atualizada</p><h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{selected.name} ativado</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">{result.message}</p>{result.purchaseId && <p className="mt-4 text-[11px] text-slate-500">Transação de teste: {result.purchaseId}</p>}<div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href="/planos" className="rounded-xl bg-amber-500 px-4 py-3 text-center text-xs font-black text-slate-950 hover:bg-amber-400">Ver meu plano</Link><Link href="/cotacoes?view=received" className="rounded-xl border border-slate-200 px-4 py-3 text-center text-xs font-black text-slate-700 dark:border-slate-700 dark:text-slate-200">Voltar ao radar</Link></div></section></div>

  return <div className="mx-auto max-w-xl space-y-4 py-4 pb-12 sm:py-6"><Link href="/planos" className="inline-flex min-h-11 items-center gap-2 px-1 text-xs font-black text-slate-500 transition hover:text-amber-500"><ArrowLeft className="h-4 w-4" /> Voltar para planos</Link><header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-600 dark:text-amber-400">Checkout do lojista</p><h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">Confirme sua assinatura</h1><p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Escolha o plano e o ciclo que fazem sentido para sua loja na Grande São Luís.</p></div><CreditCard className="h-7 w-7 shrink-0 text-amber-500" /></div><div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-950"><button type="button" onClick={() => setCycle('MONTHLY')} className={`min-h-12 rounded-xl px-2 text-xs font-black transition ${cycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Mensal<br /><span className="text-sm">{money(selected.monthly)}</span></button><button type="button" onClick={() => setCycle('ANNUALLY')} className={`relative min-h-12 rounded-xl px-2 text-xs font-black transition ${cycle === 'ANNUALLY' ? 'bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Anual<br /><span className="text-sm">{money(selected.annual)}</span>{saving > 0 && <span className="absolute -right-1 -top-3 rounded-full bg-emerald-500 px-2 py-1 text-[9px] text-white">Economize {money(saving)}</span>}</button></div></header><div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-950"><button type="button" onClick={() => setPlan('PRO')} className={`min-h-11 rounded-xl px-3 text-xs font-black transition ${plan === 'PRO' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-500 dark:text-slate-400'}`}>Plano Pro</button><button type="button" onClick={() => setPlan('PREMIUM')} className={`min-h-11 rounded-xl px-3 text-xs font-black transition ${plan === 'PREMIUM' ? 'bg-violet-500 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}>Plano Premium</button></div><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><div><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${selected.badgeClass}`}>{selected.badge}</span><h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selected.name}</h2></div><div className="text-right"><strong className="block text-2xl font-black text-slate-900 dark:text-white">{money(amount)}</strong><span className="text-[11px] text-slate-500">/{cycle === 'ANNUALLY' ? 'ano' : 'mês'}</span></div></div><ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300"><li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-500" />Renovação mensal de até <strong>{selected.quota} cotações</strong></li><li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-500" />Compra de créditos extras por <strong>R$ 2,50/unidade</strong></li><li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-500" />{selected.benefit} na Grande São Luís</li></ul></section><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><h2 className="text-sm font-black text-slate-900 dark:text-white">Forma de pagamento</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800">Modo teste</span></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setPaymentMethod('PIX')} className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border text-xs font-black transition ${paymentMethod === 'PIX' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'}`}><QrCode className="h-5 w-5" />PIX QR Code</button><button type="button" onClick={() => setPaymentMethod('CREDIT_CARD')} className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border text-xs font-black transition ${paymentMethod === 'CREDIT_CARD' ? 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/30 dark:text-sky-300' : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'}`}><CreditCard className="h-5 w-5" />Cartão de Crédito</button></div><div className="mt-4 flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500 dark:bg-slate-950 dark:text-slate-400"><Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />Ambiente de checkout integrado em modo de teste/preparação. Nenhuma cobrança real será realizada.</div></section>{result?.success === false && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{result.message}</div>}<button type="button" onClick={confirmSubscription} disabled={sending} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-[.98] hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">{sending ? 'Registrando assinatura...' : 'Confirmar Assinatura'}<Wallet className="h-5 w-5" /></button><p className="flex items-start gap-2 px-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />A intenção de compra é registrada com segurança. Nesta fase de preparação, a aprovação é simulada para validar o fluxo.</p></div>
}
