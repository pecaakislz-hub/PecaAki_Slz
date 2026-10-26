'use client'

import { useState } from 'react'
import { CreditCard, QrCode, Wallet, X } from 'lucide-react'

export default function BuyExtraCreditsModal({ open, onClose, onPurchased }: { open: boolean; onClose: () => void; onPurchased?: () => void }) {
  const [quantity, setQuantity] = useState(10)
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  if (!open) return null
  const amount = quantity * 2.5
  const submit = async () => {
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/subscriptions/extra-credits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity, paymentMethod, simulateApproval: true }) })
      const data = await response.json()
      if (!response.ok) { setMessage(data.error || 'Não foi possível liberar os créditos.'); return }
      setMessage(data.message); onPurchased?.()
    } catch { setMessage('Falha de comunicação com o servidor.') } finally { setBusy(false) }
  }
  return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label="Comprar créditos extras"><button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Fechar" /><section className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-amber-600 dark:text-amber-400">Créditos extras</p><h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Não perca novas vendas</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Cada crédito libera uma resposta adicional por R$ 2,50.</p></div><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Fechar modal"><X className="h-5 w-5" /></button></div><div className="mt-5 grid grid-cols-3 gap-2">{[10, 20, 50].map((item) => <button key={item} type="button" onClick={() => setQuantity(item)} className={`min-h-20 rounded-2xl border px-2 text-center transition ${quantity === item ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}><strong className="block text-lg font-black">{item}</strong><span className="text-[11px]">R$ {(item * 2.5).toFixed(2).replace('.', ',')}</span></button>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setPaymentMethod('PIX')} className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border text-xs font-black ${paymentMethod === 'PIX' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}><QrCode className="h-4 w-4" /> PIX</button><button type="button" onClick={() => setPaymentMethod('CREDIT_CARD')} className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border text-xs font-black ${paymentMethod === 'CREDIT_CARD' ? 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/30 dark:text-sky-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}><CreditCard className="h-4 w-4" /> Cartão</button></div>{message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">{message}</p>}<button type="button" onClick={submit} disabled={busy} className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-[.98] disabled:opacity-60">{busy ? 'Liberando créditos...' : `Confirmar e liberar ${quantity} créditos`}<Wallet className="h-5 w-5" /></button><p className="mt-3 text-center text-[10px] text-slate-500">Ambiente de checkout em modo de teste/preparação. Nenhuma cobrança real será realizada.</p></section></div>
}
