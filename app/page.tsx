'use client'

import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import { CheckCircle2, MapPin, ShoppingBag, Store, Truck, Wrench } from 'lucide-react'

const actionCards = [
  { title: 'COMPRAR', subtitle: 'Peça uma cotação', detail: 'Informe seu veículo e receba ofertas locais.', href: '/cotacoes/nova', icon: ShoppingBag, tone: 'from-sky-500/15 via-cyan-500/10 to-white/70 dark:from-sky-400/20 dark:via-cyan-400/10 dark:to-slate-900', accent: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200/80 dark:border-sky-800/70' },
  { title: 'VENDER', subtitle: 'Receba pedidos', detail: 'Responda cotações de carros e motos.', href: '/lojista/radar', icon: Store, tone: 'from-emerald-500/15 via-teal-500/10 to-white/70 dark:from-emerald-400/20 dark:via-teal-400/10 dark:to-slate-900', accent: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200/80 dark:border-emerald-800/70' },
  { title: 'OFICINAS', subtitle: 'Solicite atendimento', detail: 'Encontre ajuda especializada para seu veículo.', href: '/cotacoes/nova?service=oficina', icon: Wrench, tone: 'from-amber-500/18 via-orange-400/10 to-white/70 dark:from-amber-400/20 dark:via-orange-400/10 dark:to-slate-900', accent: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200/80 dark:border-amber-800/70' },
  { title: 'GUINCHOS', subtitle: 'Solicite reboque', detail: 'Peça socorro para carros e motos na região.', href: '/cotacoes/nova?service=guincho', icon: Truck, tone: 'from-violet-500/15 via-indigo-400/10 to-white/70 dark:from-violet-400/20 dark:via-indigo-400/10 dark:to-slate-900', accent: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200/80 dark:border-violet-800/70' },
]

export default function HomeDashboard() {
  const { theme } = useTheme()
  const darkMode = theme === 'dark'

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <main className="mx-auto w-full max-w-5xl px-3 py-4 pb-6 sm:px-5 lg:px-8">
        <section className="relative isolate mb-6 overflow-hidden rounded-[2rem] border border-slate-300/80 bg-slate-100 shadow-[0_24px_70px_-30px_rgba(71,85,105,.38)] dark:border-slate-600/80 dark:bg-slate-800">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_8%,rgba(14,165,233,.24),transparent_36%),radial-gradient(circle_at_92%_88%,rgba(245,158,11,.22),transparent_40%),linear-gradient(135deg,#f8fafc,#e2e8f0)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(56,189,248,.22),transparent_36%),radial-gradient(circle_at_92%_88%,rgba(245,158,11,.16),transparent_40%),linear-gradient(135deg,#334155,#1e293b)]" />
          <div className="absolute inset-0 -z-10 bg-white/25 bg-contain bg-center bg-no-repeat opacity-55 mix-blend-multiply sm:bg-cover dark:bg-slate-950/20 dark:opacity-60 dark:mix-blend-normal" style={{ backgroundImage: "url('/banner-pecaaki-automotivo.jpg')" }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/78 via-white/42 to-amber-50/68 dark:from-slate-900/58 dark:via-slate-800/38 dark:to-slate-900/62" />
          <div className="relative grid gap-7 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-12 lg:py-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/78 px-3.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-lg backdrop-blur-md sm:text-xs dark:border-white/20 dark:bg-slate-900/55 dark:text-slate-100"><MapPin className="h-4 w-4 text-amber-300" /> Cobertura: São Luís, Paço, Ribamar e Raposa</div>
              <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">A peça certa, o serviço certo, <span className="text-amber-700 dark:text-amber-300">perto de você.</span></h1>
              <p className="hero-copy-outline mt-4 max-w-xl rounded-2xl border border-white/75 bg-white/48 px-3 py-2 text-sm leading-relaxed text-slate-700 shadow-sm backdrop-blur-[2px] sm:text-base dark:border-slate-700/75 dark:bg-slate-900/38 dark:text-slate-200">Faça sua cotação para carros e motos e conecte-se a vendedores, oficinas e guinchos da Grande São Luís.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/cotacoes/nova" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-300 active:scale-[.98]"><ShoppingBag className="h-4 w-4" /> Comprar peças</Link><Link href="/lojista/radar" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-700/80 bg-white/95 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white active:scale-[.98] dark:border-amber-300/75 dark:bg-slate-950/82 dark:text-white dark:shadow-black/30 dark:hover:bg-slate-900"><Store className="h-4 w-4" /> Vender peças</Link></div>
            </div>
            <div id="como-funciona" className="rounded-3xl border border-slate-300/75 bg-white/72 p-4 shadow-xl shadow-slate-500/10 backdrop-blur-xl sm:p-5 dark:border-white/20 dark:bg-slate-900/48"><div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-amber-700 dark:text-amber-200"><CheckCircle2 className="h-4 w-4" /> Como funciona</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{['Informe veículo e peça', 'Receba ofertas locais', 'Compare preço e prazo', 'Escolha e combine a entrega'].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-2xl border border-slate-300/65 bg-white/68 px-3 py-2.5 dark:border-white/10 dark:bg-slate-950/35"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-slate-950">{index + 1}</span><span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{step}</span></div>)}</div></div>
          </div>
        </section>

        <section aria-labelledby="acoes-title"><div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-amber-600 dark:text-amber-400">Escolha seu caminho</p><h2 id="acoes-title" className="mt-1 text-xl font-black sm:text-2xl">Encontre ou ofereça ajuda</h2></div><span className="hidden text-right text-xs text-slate-500 sm:block">Ações rápidas para sua necessidade</span></div><div className="grid grid-cols-2 gap-3 sm:gap-4">{actionCards.map(({ title, subtitle, detail, href, icon: Icon, tone, accent, border }) => <Link key={title} href={href} className={`group relative min-h-[172px] overflow-hidden rounded-3xl border bg-gradient-to-br ${tone} ${border} p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[.98] sm:min-h-[190px] sm:p-5`}><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl transition group-hover:scale-150" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between gap-2"><div><p className={`text-[11px] font-black tracking-[.14em] ${accent}`}>{title}</p><h3 className="mt-1 text-sm font-black text-slate-900 dark:text-white sm:text-base">{subtitle}</h3></div><span className={`rounded-2xl bg-white/75 p-2.5 shadow-sm dark:bg-slate-950/50 ${accent}`}><Icon className="h-5 w-5" /></span></div><p className="max-w-[15rem] text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xs">{detail}</p><span className={`text-[11px] font-black ${accent}`}>Acessar agora →</span></div></Link>)}</div></section>
      </main>

    </div>
  )
}
