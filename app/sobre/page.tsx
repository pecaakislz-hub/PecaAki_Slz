import Link from 'next/link'
import { Info, MapPin, ShieldCheck, HeartHandshake, Wrench, Store, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Sobre Nós - PeçaAki (Grande São Luís)',
  description: 'Conheça a história e a missão do PeçaAki, o marketplace reverso de cotação de autopeças e motopeças focado na Grande São Luís, Maranhão.'
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* HEADER HERO */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 space-y-4 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-3xl mx-auto shadow-xl shadow-amber-500/20">
          P⚡
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Sobre o <span className="text-amber-400">PeçaAki</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Conectando motoristas, motociclistas e mecânicos das autopeças tradicionais da Grande São Luís de forma rápida, justa e digital.
        </p>
      </div>

      {/* HISTÓRIA E PROPÓSITO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Nossa Origem na Ilha</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nascido em São Luís do Maranhão, o PeçaAki surgiu para resolver a antiga peregrinação de procurar peças em bairros como Alemanha, Cohab, Maiobão e Turu. Em vez de fazer dezenas de ligações ou rodar quilômetros pela Av. dos Franceses e Jerônimo de Albuquerque, o comprador envia o pedido e as lojas respondem em minutos.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Marketplace Reverso</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ao contrário dos e-commerces tradicionais, aqui a demanda dita a oferta. O comprador envia os dados do seu veículo e a foto da peça danificada. As autopeças e motopeças cadastradas na Grande São Luís disputam o pedido enviando o melhor valor à vista (PIX), parcelado e prazo de entrega.
          </p>
        </div>
      </div>

      {/* MUNICÍPIOS ATENDIDOS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-extrabold text-white text-center">Região Metropolitana Atendida</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-lg font-black text-amber-400 mb-1">São Luís</div>
            <div className="text-[11px] text-slate-400">Alemanha, Cohab, Renascença, Tirirical...</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-lg font-black text-amber-400 mb-1">Paço do Lumiar</div>
            <div className="text-[11px] text-slate-400">Maiobão, Paranã, Mocajituba...</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-lg font-black text-amber-400 mb-1">Ribamar</div>
            <div className="text-[11px] text-slate-400">Parque Vitória, Araçagy, Centro...</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-lg font-black text-amber-400 mb-1">Raposa</div>
            <div className="text-[11px] text-slate-400">Centro, Carananduba...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
