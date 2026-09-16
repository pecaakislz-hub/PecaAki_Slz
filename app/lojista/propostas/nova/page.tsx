'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Store, ArrowLeft, DollarSign, Clock, Truck, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react'

function NewProposalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cotacaoId = searchParams.get('cotacaoId')

  const [quote, setQuote] = useState<any>(null)
  const [loadingQuote, setLoadingQuote] = useState(true)

  // Form states
  const [availability, setAvailability] = useState<'IN_STOCK' | 'ON_ORDER'>('IN_STOCK')
  const [condition, setCondition] = useState<'NEW' | 'ORIGINAL' | 'SIMILAR' | 'USED'>('NEW')
  const [cashPrice, setCashPrice] = useState('')
  const [installmentPrice, setInstallmentPrice] = useState('')
  const [deliveryFee, setDeliveryFee] = useState('0')
  const [deliveryTime, setDeliveryTime] = useState('Em até 2 horas')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cotacaoId) return
    fetch(`/api/quotes/${cotacaoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.quote) setQuote(data.quote)
      })
      .catch(() => {})
      .finally(() => setLoadingQuote(false))
  }, [cotacaoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteRequestId: cotacaoId,
          availability,
          condition,
          cashPrice,
          installmentPrice,
          deliveryFee,
          deliveryTime,
          notes
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar proposta')
        setSubmitting(false)
        return
      }

      router.push(`/cotacoes/${cotacaoId}`)
      router.refresh()
    } catch (err) {
      setError('Falha de conexão com o servidor')
      setSubmitting(false)
    }
  }

  if (loadingQuote) {
    return <div className="text-center py-16 text-slate-400 text-sm">Carregando detalhes do pedido...</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <Link href="/lojista/radar" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-xs font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para o Radar de Cotações
      </Link>

      {/* CARD DO PEDIDO */}
      {quote && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Pedido do Comprador em {quote.user?.neighborhood || 'São Luís'}
          </div>
          <h2 className="text-xl font-black text-white">{quote.partName}</h2>
          <p className="text-xs text-slate-300">{quote.description}</p>
          {quote.vehicle && (
            <div className="text-xs text-slate-400 font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">
              🚗 {quote.vehicle.brand} {quote.vehicle.model} ({quote.vehicle.year})
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* FORMULÁRIO DE ORÇAMENTO */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <DollarSign className="w-5 h-5 text-amber-400" /> Enviar Proposta Comercial
        </h3>

        {/* Condição & Estoque */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Disponibilidade</label>
            <select
              value={availability}
              onChange={(e: any) => setAvailability(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="IN_STOCK">Em Estoque (Pronta Entrega)</option>
              <option value="ON_ORDER">Sob Encomenda (Encomendar)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Condição da Peça</label>
            <select
              value={condition}
              onChange={(e: any) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="NEW">Nova com Garantia</option>
              <option value="ORIGINAL">Original Montadora</option>
              <option value="SIMILAR">Similar (Primeira Linha)</option>
              <option value="USED">Usada / Desmanche Credenciado</option>
            </select>
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Valor À Vista / PIX (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={cashPrice}
              onChange={(e) => setCashPrice(e.target.value)}
              placeholder="Ex: 180.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500 font-bold text-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Parcelado no Cartão (R$)</label>
            <input
              type="number"
              step="0.01"
              value={installmentPrice}
              onChange={(e) => setInstallmentPrice(e.target.value)}
              placeholder="Ex: 200.00 em até 3x"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Entrega e Frete */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Valor do Frete / Entrega (R$)</label>
            <input
              type="number"
              step="0.01"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              placeholder="0.00 (Caso seja grátis)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Prazo de Entrega Estimado</label>
            <input
              type="text"
              required
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="Ex: Até 2h (Motoboy) / Imediato no balcão"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Marca exata da peça, garantia e observações adicionais
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Peça da marca Cofap TurboGás com 2 anos de garantia direto na nossa loja na Alemanha."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {submitting ? 'Transmitindo Orçamento...' : 'Enviar Orçamento ao Comprador'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 p-8 flex items-center justify-center">Carregando formulário de proposta...</div>}>
      <NewProposalContent />
    </Suspense>
  )
}
