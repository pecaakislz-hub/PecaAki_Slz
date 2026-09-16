'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Store, Sparkles } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl">
          📞
        </div>
        <h1 className="text-3xl font-black text-white">Atendimento & Suporte</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Fale com nossa equipe comercial na Grande São Luís ou tire suas dúvidas sobre cotações e credenciamento de lojas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* CARDS DE CONTATO DIRETO */}
        <div className="md:col-span-5 space-y-4">
          <a
            href="https://wa.me/5598988776655?text=Olá%20PeçaAki!%20Preciso%20de%20suporte%20na%20plataforma."
            target="_blank"
            rel="noreferrer"
            className="block bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              WhatsApp Comercial
            </h3>
            <p className="text-xs text-slate-400">(98) 98877-6655</p>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              Atendimento Imediato →
            </span>
          </a>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-400" /> Sede Comercial na Ilha
            </div>
            <p className="text-slate-400">
              Av. dos Holandeses, Quadra 12 - Ed. Calhau Corporate, Sala 402 - Calhau, São Luís - MA
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-semibold">
              E-mail: contato@pecaaki.com.br
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-6 rounded-3xl space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
              <Store className="w-4 h-4" /> Quer Credenciar sua Loja?
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cadastre sua autopeça ou motopeça e comece a responder cotações nos bairros da Grande São Luís ainda hoje.
            </p>
          </div>
        </div>

        {/* FORMULÁRIO DE ATENDIMENTO */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Envie uma Mensagem</h2>

          {sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Mensagem Enviada!</h3>
              <p className="text-xs text-slate-300">
                Nossa equipe entrará em contato via WhatsApp em até 1 hora comercial.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp de Contato</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(98) 98888-7777"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mensagem ou Dúvida</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Como podemos te ajudar hoje?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Send className="w-4 h-4" /> Enviar Mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
