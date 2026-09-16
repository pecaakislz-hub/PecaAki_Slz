'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, ShieldCheck, MapPin, Phone, Building, CheckCircle2, Award } from 'lucide-react'

export default function LojistaPerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Carregando dados da loja...</div>
  }

  const store = user?.storeProfile

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-2xl">
              🏬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{store?.fantasyName || user?.name}</h1>
                <span title="Loja Credenciada no PeçaAki"><ShieldCheck className="w-5 h-5 text-emerald-400" /></span>
              </div>
              <p className="text-xs text-slate-400">{store?.companyName}</p>
            </div>
          </div>

          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Credenciada
          </span>
        </div>

        {/* Informações de Contato e Localização */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Localização na Ilha</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" /> Bairro {store?.neighborhood || user?.neighborhood}, {store?.city || user?.city}
            </p>
            <p className="text-xs text-slate-400">{store?.address || 'Endereço Comercial Cadastrado'}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">WhatsApp Comercial</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-400" /> {store?.phone || user?.phone}
            </p>
            <p className="text-xs text-slate-400">CNPJ/CPF: {store?.cnpjCpf || 'Verificado'}</p>
          </div>
        </div>

        {/* Categorias Atendidas */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Especialidades e Categorias Atendidas</h3>
          <div className="flex flex-wrap gap-2">
            {['Auto Novas', 'Motopeças', 'Lataria', 'Peças Usadas com Garantia', 'Suspensão', 'Freios', 'Motor'].map((cat) => (
              <span key={cat} className="bg-slate-800 text-slate-200 border border-slate-700 text-xs px-3 py-1 rounded-xl font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
