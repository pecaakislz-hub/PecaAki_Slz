'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User, Store, Mail, Phone, Lock, MapPin, Building, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [role, setRole] = useState<'COMPRADOR' | 'LOJISTA'>('COMPRADOR')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('São Luís')
  const [neighborhood, setNeighborhood] = useState('')
  
  // Dados de Lojista
  const [companyName, setCompanyName] = useState('')
  const [fantasyName, setFantasyName] = useState('')
  const [cnpjCpf, setCnpjCpf] = useState('')
  const [address, setAddress] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'LOJISTA') setRole('LOJISTA')
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: any = {
        name,
        email,
        password,
        phone,
        role,
        city,
        neighborhood: neighborhood || 'Centro'
      }

      if (role === 'LOJISTA') {
        payload.storeData = {
          companyName: companyName || name,
          fantasyName: fantasyName || name,
          cnpjCpf,
          phone,
          city,
          neighborhood: neighborhood || 'Alemanha',
          address,
          categories: ['Auto', 'Moto'],
          vehicleBrands: ['Chevrolet', 'Fiat', 'Volkswagen', 'Honda', 'Toyota', 'Yamaha']
        }
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao realizar cadastro')
        setLoading(false)
        return
      }

      if (role === 'LOJISTA') {
        router.push('/lojista/radar')
      } else {
        router.push('/garagem')
      }
      router.refresh()
    } catch (err) {
      setError('Falha na comunicação com o servidor')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-2xl mx-auto shadow-lg shadow-amber-500/20">
            P⚡
          </div>
          <h1 className="text-2xl font-bold text-white">Criar Conta no PeçaAki</h1>
          <p className="text-xs text-slate-400">Selecione seu perfil de acesso na Grande São Luís</p>
        </div>

        {/* Seletor de Perfil */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('COMPRADOR')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'COMPRADOR'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Comprador / Mecânico
          </button>
          <button
            type="button"
            onClick={() => setRole('LOJISTA')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'LOJISTA'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" /> Autopeça / Motopeça
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {role === 'LOJISTA' ? 'Nome do Responsável' : 'Nome Completo'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Telefone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(98) 98888-7777"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Município da Grande SLZ</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="São Luís">São Luís</option>
                <option value="Paço do Lumiar">Paço do Lumiar</option>
                <option value="São José de Ribamar">São José de Ribamar</option>
                <option value="Raposa">Raposa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bairro</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Alemanha, Cohab, Maiobão..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Campos adicionais para Lojistas */}
          {role === 'LOJISTA' && (
            <div className="space-y-4 pt-4 border-t border-slate-800 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Informações Comerciais da Loja
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Fantasia da Loja</label>
                  <input
                    type="text"
                    required
                    value={fantasyName}
                    onChange={(e) => setFantasyName(e.target.value)}
                    placeholder="Ex: São Luís Auto Peças"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CNPJ ou CPF</label>
                  <input
                    type="text"
                    required
                    value={cnpjCpf}
                    onChange={(e) => setCnpjCpf(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Jerônimo de Albuquerque, 100 - Cohab"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ao se cadastrar, você concorda com nossos <Link href="/termos" className="text-amber-400 underline">Termos</Link> e <Link href="/privacidade" className="text-amber-400 underline">LGPD</Link>.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Já possui conta?{' '}
          <Link href="/login" className="text-amber-400 font-bold hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  )
}
