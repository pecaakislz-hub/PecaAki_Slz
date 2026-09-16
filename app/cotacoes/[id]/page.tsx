'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Truck, ShieldCheck, CheckCircle2, MessageCircle, Store, Clock, Award, PhoneCall, ExternalLink, Image as ImageIcon } from 'lucide-react'

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/quotes/${params.id}`)
      const data = await res.json()
      if (res.ok && data.quote) {
        setQuote(data.quote)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) fetchQuote()
  }, [params.id])

  const handleAcceptProposal = async (proposal: any) => {
    setAcceptingId(proposal.id)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ACCEPT',
          proposalId: proposal.id
        })
      })

      if (res.ok) {
        // Redirecionar para WhatsApp da loja com mensagem pré-formatada
        const storePhone = proposal.storeProfile.phone.replace(/\D/g, '')
        const message = `Olá ${proposal.storeProfile.fantasyName}! Aceitei sua proposta no PeçaAki para a peça "${quote.partName}". Podemos concluir o pagamento e a entrega?`
        const whatsappUrl = `https://wa.me/55${storePhone}?text=${encodeURIComponent(message)}`
        
        window.open(whatsappUrl, '_blank')
        fetchQuote()
      }
    } catch (e) {
      alert('Erro ao aceitar proposta')
    } finally {
      setAcceptingId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Carregando detalhes da cotação...</div>
  }

  if (!quote) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-white">Cotação não encontrada</h2>
        <Link href="/cotacoes" className="text-amber-400 font-bold underline text-sm">
          Voltar para Minhas Cotações
        </Link>
      </div>
    )
  }

  const photosList = quote.photos ? JSON.parse(quote.photos) : []
  const targetCitiesList = quote.targetCities ? JSON.parse(quote.targetCities) : []

  return (
    <div className="space-y-8 py-4">
      {/* NAVEGAÇÃO DE VOLTA */}
      <Link href="/cotacoes" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-xs font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Minhas Cotações
      </Link>

      {/* DETALHES DO PEDIDO DE COTAÇÃO */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                {quote.category}
              </span>
              <span className="text-xs text-slate-500">
                Publicado em {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{quote.partName}</h1>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                quote.status === 'ACCEPTED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {quote.status === 'ACCEPTED' ? 'Proposta Aceita' : `${quote.proposals.length} Orçamento(s) Recebido(s)`}
            </span>
          </div>
        </div>

        {/* INFORMAÇÕES DO VEÍCULO E DESCRIÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Veículo Solicitado</h4>
              {quote.vehicle ? (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm font-semibold text-white flex items-center gap-2">
                  🚗 {quote.vehicle.brand} {quote.vehicle.model} ({quote.vehicle.year}) • Motor {quote.vehicle.engine} {quote.vehicle.plate ? `[${quote.vehicle.plate}]` : ''}
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm font-semibold text-white">
                  🚗 {quote.vehicleText}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Descrição e Especificações</h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                {quote.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <div>
                <strong>Entrega:</strong> {quote.deliveryPreference === 'DELIVERY' ? 'Entrega no Bairro (Motoboy)' : 'Retirada no Balcão'}
              </div>
              <div>
                <strong>Municípios Alvo:</strong> {targetCitiesList.join(', ')}
              </div>
            </div>
          </div>

          {/* GALERIA DE FOTOS */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Fotos Anexadas ({photosList.length})
            </h4>

            {photosList.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {photosList.map((url: string, idx: number) => (
                  <a key={idx} href={url} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500 transition-colors">
                    <img src={url} alt={`Peça ${idx + 1}`} className="w-full h-24 object-cover" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                Nenhuma foto anexada
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEÇÃO DE PROPOSTAS / ORÇAMENTOS RECEBIDOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-400" /> Orçamentos Recebidos das Lojas ({quote.proposals.length})
          </h2>
          <span className="text-xs text-slate-400">Ordenado pelo menor preço à vista (PIX)</span>
        </div>

        {quote.proposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quote.proposals.map((p: any, index: number) => (
              <div
                key={p.id}
                className={`bg-slate-900 rounded-3xl p-6 border transition-all space-y-4 relative ${
                  p.status === 'ACCEPTED'
                    ? 'border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : index === 0
                    ? 'border-amber-500/60 shadow-xl shadow-amber-500/10'
                    : 'border-slate-800'
                }`}
              >
                {/* Badge de Melhor Preço */}
                {index === 0 && p.status !== 'ACCEPTED' && (
                  <div className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Award className="w-3.5 h-3.5" /> Menor Preço
                  </div>
                )}

                {/* Dados da Loja */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base flex items-center gap-1.5">
                      {p.storeProfile.fantasyName}
                      <span title="Loja Credenciada"><ShieldCheck className="w-4 h-4 text-emerald-400" /></span>
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" /> Bairro {p.storeProfile.neighborhood}, {p.storeProfile.city}
                    </p>
                  </div>
                </div>

                {/* Preços e Condições */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-medium">À vista (PIX / Dinheiro):</span>
                    <span className="text-2xl font-black text-amber-400">
                      R$ {p.cashPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {p.installmentPrice && (
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Cartão / Parcelado:</span>
                      <span>R$ {p.installmentPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>Taxa de Frete:</span>
                    <span className="font-semibold text-slate-200">
                      {p.deliveryFee === 0 ? 'Grátis / Incluso' : `R$ ${p.deliveryFee.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Tempo de Entrega:
                    </span>
                    <span className="font-bold text-emerald-400">{p.deliveryTime}</span>
                  </div>
                </div>

                {/* Detalhes do Produto / Observações */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                      Condição: {p.condition === 'NEW' ? 'Nova' : p.condition === 'ORIGINAL' ? 'Original' : p.condition === 'SIMILAR' ? 'Similar Primeira Linha' : 'Usada'}
                    </span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                      Estoque: {p.availability === 'IN_STOCK' ? 'Pronta Entrega' : 'Sob Encomenda'}
                    </span>
                  </div>

                  {p.notes && (
                    <p className="text-slate-300 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                      "{p.notes}"
                    </p>
                  )}
                </div>

                {/* Botão de Aceitar / WhatsApp */}
                <div className="pt-2">
                  {p.status === 'ACCEPTED' ? (
                    <a
                      href={`https://wa.me/55${p.storeProfile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Aceitei a proposta no PeçaAki para "${quote.partName}".`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Conversar no WhatsApp da Loja
                    </a>
                  ) : (
                    <button
                      onClick={() => handleAcceptProposal(p)}
                      disabled={acceptingId === p.id || quote.status === 'ACCEPTED'}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      <MessageCircle className="w-4.5 h-4.5" />
                      {acceptingId === p.id ? 'Processando...' : 'Aceitar Proposta & Abrir WhatsApp'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl">
              ⌛
            </div>
            <h3 className="text-base font-bold text-white">Aguardando orçamentos dos lojistas</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Sua cotação foi transmitida para as lojas de autopeças e motopeças da Grande São Luís. Assim que uma proposta for enviada, você receberá a notificação!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
