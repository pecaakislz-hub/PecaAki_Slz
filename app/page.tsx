import Link from 'next/link'
import { PlusCircle, MapPin, Clock, Wrench, Car, ArrowRight, Store, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react'
import { db } from '@/lib/db'

export const revalidate = 0

async function getRecentQuotes() {
  try {
    const quotes = await db.findQuotes()
    return quotes.slice(0, 4)
  } catch (error) {
    return []
  }
}

export default async function HomePage() {
  const recentQuotes = await getRecentQuotes()

  return (
    <div className="space-y-12 py-4">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>O 1º Marketplace Reverso de Peças da Grande São Luís</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Economize tempo e dinheiro na compra de <span className="text-amber-400">peças auto e moto</span> na Ilha!
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Publique o que você precisa com dados do veículo e foto da peça danificada. As melhores autopeças e motopeças da <strong>Grande São Luís</strong> enviam orçamentos competitivos direto para você.
            </p>

            {/* Badges dos Municípios */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-300 font-medium pt-1">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <MapPin className="w-3 h-3 text-amber-400" /> São Luís
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <MapPin className="w-3 h-3 text-amber-400" /> Paço do Lumiar
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <MapPin className="w-3 h-3 text-amber-400" /> São José de Ribamar
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <MapPin className="w-3 h-3 text-amber-400" /> Raposa
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/cotacoes/nova"
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base px-6 py-3.5 rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Pedir Peça Agora (Grátis)
              </Link>
              <Link
                href="/garagem"
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-base px-5 py-3.5 rounded-xl border border-slate-700 transition-colors"
              >
                <Car className="w-5 h-5 text-amber-400" />
                Minha Garagem Virtual
              </Link>
            </div>
          </div>

          {/* Card Flutuante de Exemplo / CTA Lojista */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                  <Store className="w-4 h-4" /> Para Lojistas e Desmanches
                </span>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Radar Ativo
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                Possui autopeça ou motopeça na Grande São Luís?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receba solicitações diárias de mecânicos e motoristas dos bairros Alemanha, Cohab, Maiobão, Turu, Renascença e Ribamar.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>🚀 Cotações em tempo real</span>
                  <span className="text-amber-400">Zero comissão intermediária</span>
                </div>
                <div className="text-slate-400">Responda pelo app e conclua a venda direto no seu WhatsApp!</div>
              </div>

              <Link
                href="/lojista/radar"
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold text-sm py-3 rounded-xl transition-all"
              >
                Acessar Radar de Cotações <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (3 PASSOS REVERSOS) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Como Funciona o PeçaAki</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Esqueça a saga de ligar para dezenas de lojas na Ilha. No PeçaAki, os orçamentos vêm até você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Descreva o Pedido</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Selecione o veículo da Garagem ou digite o modelo, informe o nome da peça e faça upload da foto (peça quebrada ou etiqueta).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Receba Orçamentos Locais</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Lojas credenciadas de São Luís, Paço do Lumiar e Ribamar notificam disponibilidade, preço à vista (PIX), parcelado e prazo de entrega.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Escolha & Chame no Zap</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Compare as propostas recebidas, selecione a melhor opção (preço ou rapidez) e feche a negociação com 1 clique no WhatsApp da loja!
            </p>
          </div>
        </div>
      </section>

      {/* FEED DE COTAÇÕES RECENTES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Em Tempo Real
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Cotações Ativas na Grande São Luís</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Pedidos reais publicados recentemente por motoristas e mecânicos locais</p>
          </div>
          <Link
            href="/cotacoes"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 self-start sm:self-auto"
          >
            Ver Todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentQuotes.map((q: any) => {
            const hasProposals = q.proposals && q.proposals.length > 0
            const bestProposal = hasProposals ? q.proposals[0] : null

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-amber-500/50 shadow-sm dark:shadow-none transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                        {q.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1.5 line-clamp-1">
                        {q.partName}
                      </h3>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        q.status === 'ANSWERED'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : q.status === 'ACCEPTED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {q.status === 'ANSWERED'
                        ? `${q.proposals?.length} Orçamentos`
                        : q.status === 'ACCEPTED'
                        ? 'Concluída'
                        : 'Aberta'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {q.description}
                  </p>

                  {/* Dados do Veículo & Local */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>
                        {q.vehicle ? `${q.vehicle.brand} ${q.vehicle.model} (${q.vehicle.year})` : q.vehicleText || 'Veículo não informado'}
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500 dark:text-amber-400" /> {q.user?.city || 'São Luís'} • Bairro {q.user?.neighborhood || 'Centro'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(q.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Melhor Proposta ou Botão */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  {bestProposal ? (
                    <div className="text-xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Melhor oferta recebida:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        R$ {bestProposal.cashPrice.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">à vista</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium italic">Aguardando lojistas...</span>
                  )}

                  <Link
                    href={`/cotacoes/${q.id}`}
                    className="text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Detalhes →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* VANTAGENS DO PEÇAAKI NA ILHA */}
      <section className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center">
          Por que usar o PeçaAki em São Luís e Região?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Foco em Mecânicos e Motoristas</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Cadastre toda a frota da sua mecânica ou carros de aplicativo na Garagem Virtual e faça cotações com 1 toque.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Lojas Credenciadas e Seguras</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Parceria direta com as tradicionais lojas de autopeças e motopeças dos bairros Alemanha, Cohab e Maiobão.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Atendimento Via WhatsApp</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Zero burocracia. Ao aceitar um orçamento, você fala diretamente com o vendedor pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
