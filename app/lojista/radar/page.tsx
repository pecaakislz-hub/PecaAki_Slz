'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, Radar, MapPin, Clock, Filter, PlusCircle, ArrowRight, Car, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function LojistaRadarPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')

  const fetchRadarQuotes = async () => {
    try {
      const url = `/api/quotes?scope=radar${selectedCategory !== 'Todas' ? `&category=${selectedCategory}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok && data.quotes) {
        setQuotes(data.quotes)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRadarQuotes()
  }, [selectedCategory])

  return (
    <div className="space-y-6 py-4">
      {/* HEADER DO RADAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radar className="w-4 h-4 animate-spin-slow" /> Feed em Tempo Real • Grande São Luís
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Radar de Cotações</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Veja as solicitações de motoristas e mecânicos locais e envie seus orçamentos diretamente.
          </p>
        </div>

        <Link
          href="/lojista/perfil"
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 transition-colors"
        >
          <Store className="w-4 h-4" /> Minha Loja & Especialidades
        </Link>
      </div>

      {/* FILTROS POR CATEGORIA */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {['Todas', 'Motor', 'Suspensão', 'Freios', 'Elétrica', 'Transmissão', 'Lataria', 'Vidros', 'Pneus'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE PEDIDOS NO RADAR */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">Atualizando radar de solicitações...</div>
      ) : quotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((q) => {
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-none transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Bairro {q.user?.neighborhood || 'São Luís'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {q.partName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{q.description}</p>
                  </div>

                  {q.vehicle ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      🚗 Veículo: <strong>{q.vehicle.brand} {q.vehicle.model} ({q.vehicle.year})</strong> • Engine {q.vehicle.engine || 'N/I'}
                    </div>
                  ) : q.vehicleText ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                      🚗 Veículo: <strong>{q.vehicleText}</strong>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Preferência: <strong>{q.deliveryPreference === 'DELIVERY' ? 'Entrega no Bairro' : 'Retirada'}</strong></span>
                    <span>Propostas: <strong className="text-amber-600 dark:text-amber-400">{q.proposals?.length || 0}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {new Date(q.createdAt).toLocaleDateString('pt-BR')} às {new Date(q.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <Link
                    href={`/lojista/propostas/nova?cotacaoId=${q.id}`}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    Enviar Orçamento <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl">
            📡
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum pedido atende ao filtro selecionado</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Aguarde novos pedidos de compradores da Grande São Luís no radar.
          </p>
        </div>
      )}
    </div>
  )
}
