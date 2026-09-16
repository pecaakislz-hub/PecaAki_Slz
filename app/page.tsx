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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-12 border border-slate-800 shadow-2xl">
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
            <div className="flex flex-wrap gap-2 text-xs text-slate-400 font-medium pt-1">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Como Funciona o PeçaAki</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Esqueça a saga de ligar para dezenas de lojas na Ilha. No PeçaAki, os orçamentos vêm até você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. Descreva o Pedido</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Selecione o veículo da Garagem ou digite o modelo, informe o nome da peça e faça upload da foto (peça quebrada ou etiqueta).
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. Receba Orçamentos Locais</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lojas credenciadas de São Luís, Paço do Lumiar e Ribamar notificam disponibilidade, preço à vista (PIX), parcelado e prazo de entrega.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Escolha & Chame no Zap</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare as propostas recebidas, selecione a melhor opção (preço ou rapidez) e feche a negociação com 1 clique no WhatsApp da loja!
            </p>
          </div>
        </div>
      </section>

      {/* FEED DE COTAÇÕES RECENTES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Cotações Ativas na Grande São Luís
            </h2>
            <p className="text-xs text-slate-400">Pedidos reais publicados recentemente por motoristas e mecânicos locais</p>
          </div>
          <Link href="/cotacoes" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Ver Todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentQuotes.length > 0 ? (
            recentQuotes.map((q) => (
              <div key={q.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
                      {q.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {q.user?.neighborhood || 'São Luís'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1">{q.partName}</h3>

                  <p className="text-xs text-slate-300 line-clamp-2">{q.description}</p>

                  {q.vehicle && (
                    <div className="text-[11px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      🚗 {q.vehicle.brand} {q.vehicle.model} ({q.vehicle.year})
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Propostas: <strong className="text-amber-400">{q.proposals?.length || 0}</strong>
                  </span>
                  <Link href={`/cotacoes/${q.id}`} className="text-amber-400 hover:underline font-semibold text-[11px]">
                    Detalhes →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-slate-900 p-8 rounded-xl text-center text-slate-400 text-sm border border-slate-800">
              Nenhuma cotação cadastrada no momento. Seja o primeiro a solicitar!
            </div>
          )}
        </div>
      </section>

      {/* DIFERENCIAIS DA PLATAFORMA */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Foco em Mecânicos e Motoristas</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cadastre toda a frota da sua mecânica ou carros de aplicativo na Garagem Virtual e faça cotações com 1 toque.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Lojas Credenciadas e Seguras</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Parceria direta com as tradicionais lojas de autopeças e motopeças dos bairros Alemanha, Cohab e Maiobão.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Atendimento Via WhatsApp</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero burocracia. Ao aceitar um orçamento, você fala diretamente com o vendedor pelo WhatsApp.
          </p>
        </div>
      </section>
    </div>
  )
}
