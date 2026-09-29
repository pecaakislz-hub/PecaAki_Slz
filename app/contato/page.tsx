'use client'

import { Mail, MessageCircle, Phone, Send, Store } from 'lucide-react'

const whatsapp = 'https://wa.me/5598981470668?text=Ol%C3%A1%20Pe%C3%A7aAki!%20Preciso%20de%20suporte%20na%20plataforma.'
const email = 'mailto:dsdodo18@hotmail.com?subject=Contato%20e%20suporte%20Pe%C3%A7aAki'

export default function ContactPage() {
  return <div className="mx-auto max-w-4xl space-y-8 py-8">
    <section className="surface-panel rounded-3xl border p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500"><Phone className="h-6 w-6" /></div>
      <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Atendimento e Suporte</h1>
      <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-slate-600 dark:text-slate-200 sm:text-sm">Escolha o canal mais conveniente para falar sobre cotações, cadastro, pedidos ou credenciamento de serviços.</p>
    </section>

    <div className="grid gap-5 md:grid-cols-2">
      <a href={whatsapp} target="_blank" rel="noreferrer" className="surface-panel group rounded-3xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 dark:hover:border-emerald-500">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"><MessageCircle className="h-5 w-5" /></div>
        <h2 className="mt-4 text-base font-black text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">WhatsApp Comercial</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-200">(98) 98147-0668</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-300">Chamar no WhatsApp <Send className="h-3.5 w-3.5" /></span>
      </a>

      <a href={email} className="surface-panel group rounded-3xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 dark:hover:border-amber-500">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><Mail className="h-5 w-5" /></div>
        <h2 className="mt-4 text-base font-black text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-300">Envie um e-mail</h2>
        <p className="mt-1 break-all text-sm font-semibold text-slate-600 dark:text-slate-200">dsdodo18@hotmail.com</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-600 dark:text-amber-300">Abrir mensagem de e-mail <Send className="h-3.5 w-3.5" /></span>
      </a>
    </div>

    <section className="surface-panel rounded-3xl border p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300"><Store className="h-5 w-5" /></div><div><h2 className="text-xl font-black text-slate-900 dark:text-white">Credenciamento de serviços</h2><p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200 sm:text-sm">Vendedores, oficinas e guinchos podem começar pelo cadastro do perfil correspondente e depois acessar o painel para configurar seus dados e responder às oportunidades.</p><div className="mt-4 flex flex-wrap gap-2"><a href="/cadastro?role=VENDEDOR" className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-white hover:bg-emerald-600">Cadastrar vendedor</a><a href="/cadastro?role=OFICINA" className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800">Cadastrar oficina</a><a href="/cadastro?role=GUINCHO" className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800">Cadastrar guincho</a></div></div></div>
    </section>
  </div>
}
