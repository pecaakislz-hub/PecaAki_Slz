'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Clock, MapPin, CheckCircle2, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react'

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quotes?scope=my')
      .then((res) => res.json())
      .then((data) => {
        if (data.quotes) setQuotes(data.quotes)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Minhas Cotações</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Acompanhe em tempo real os orçamentos recebidos das lojas de autopeças e motopeças.
          </p>
        </div>

        <Link
          href="/cotacoes/nova"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Nova Cotação
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">Buscando suas cotações...</div>
      ) : quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-none transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      q.status === 'ACCEPTED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : q.status === 'ANSWERED'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {q.status === 'ACCEPTED' ? 'Concluída / Aceita' : q.status === 'ANSWERED' ? 'Orçamentos Recebidos' : 'Aguardando Lojas'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(q.createdAt).toLocaleDateString('pt-BR')} às {new Date(q.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {q.proposals.length} proposta(s) recebida(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{q.partName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{q.description}</p>
                  
                  {q.vehicle ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      🚗 Veículo: <strong>{q.vehicle.brand} {q.vehicle.model} ({q.vehicle.year})</strong>
                    </div>
                  ) : q.vehicleText ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      🚗 Veículo: <strong>{q.vehicleText}</strong>
                    </div>
                  ) : null}
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <Link
                    href={`/cotacoes/${q.id}`}
                    className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    Ver Propostas & Comparar <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhuma cotação encontrada</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Você ainda não publicou nenhum pedido de peça. Crie sua primeira cotação grátis!
          </p>
          <Link
            href="/cotacoes/nova"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Pedir Peça Agora
          </Link>
        </div>
      )}
    </div>
  )
}
