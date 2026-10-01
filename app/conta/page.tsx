'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, BadgeCheck, Building2, CheckCircle2, Edit3, Loader2, Mail, MapPin, Phone, Save, ShieldCheck, Trash2, UserRound, X } from 'lucide-react'
import ProfileImageEditor from '@/components/ProfileImageEditor'

type StoreProfile = {
  companyName?: string
  fantasyName?: string
  cnpjCpf?: string
  phone?: string
  city?: string
  neighborhood?: string
  address?: string
  categories?: string
  vehicleBrands?: string
  isVerified?: boolean
}

type AccountUser = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  neighborhood: string
  address?: string
  postalCode?: string
  role: string
  avatarUrl?: string | null
  storeProfile?: StoreProfile | null
}

type AccountForm = { name: string; phone: string; city: string; neighborhood: string; address: string; postalCode: string }

const roleLabels: Record<string, string> = {
  COMPRADOR: 'Comprador',
  VENDEDOR: 'Vendedor de autopeças e motopeças',
  LOJISTA: 'Vendedor de autopeças e motopeças',
  OFICINA: 'Oficina',
  GUINCHO: 'Guincho',
  ADMIN: 'Administrador',
}

const roleDescriptions: Record<string, string> = {
  COMPRADOR: 'Perfil para solicitar peças, serviços e acompanhar seus pedidos.',
  VENDEDOR: 'Perfil comercial para cadastrar sua loja e responder às cotações.',
  LOJISTA: 'Perfil comercial para cadastrar sua loja e responder às cotações.',
  OFICINA: 'Perfil para oferecer serviços especializados de manutenção.',
  GUINCHO: 'Perfil para oferecer serviços de reboque e assistência.',
  ADMIN: 'Perfil administrativo da plataforma.',
}

function formatList(value?: string) {
  if (!value) return ''
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.join(', ') : value
  } catch {
    return value
  }
}

function InitialAvatar({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
  return <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 text-3xl font-black text-white shadow-lg shadow-amber-500/20 sm:h-28 sm:w-28 sm:text-4xl">{initials}</div>
}

function DataItem({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-700/70 dark:bg-slate-800/55"><div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400"><Icon className="h-4 w-4 text-amber-500" />{label}</div><p className="mt-2 break-words text-sm font-semibold text-slate-800 dark:text-slate-100">{value || 'Não informado'}</p></div>
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<AccountUser | null>(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [form, setForm] = useState<AccountForm>({ name: '', phone: '', city: 'São Luís', neighborhood: '', address: '', postalCode: '' })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const applyUser = (nextUser: AccountUser) => {
    setUser(nextUser)
    setAvatarUrl(nextUser.avatarUrl || '')
    setForm({ name: nextUser.name || '', phone: nextUser.phone || '', city: nextUser.city || 'São Luís', neighborhood: nextUser.neighborhood || '', address: nextUser.address || '', postalCode: nextUser.postalCode || '' })
  }

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok || !data.user) {
          router.replace('/login')
          return
        }
        applyUser(data.user)
      })
      .catch(() => setError('Não foi possível carregar seus dados.'))
      .finally(() => setLoading(false))
  }, [router])

  const updateField = (field: keyof AccountForm, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const startEditing = () => {
    setMessage('')
    setError('')
    setEditing(true)
  }

  const cancelEditing = () => {
    if (user) applyUser(user)
    setMessage('')
    setError('')
    setEditing(false)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/auth/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, avatarUrl: avatarUrl || null }) })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Não foi possível salvar os dados.'); return }
      applyUser(data.user)
      setEditing(false)
      setMessage('Dados cadastrais atualizados com sucesso.')
      router.refresh()
    } catch { setError('Falha de comunicação com o servidor.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Deseja excluir permanentemente sua conta e seus dados? Esta ação não pode ser desfeita.')) return
    setSaving(true); setError('')
    try {
      const response = await fetch('/api/auth/account', { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Não foi possível excluir a conta.'); return }
      router.replace('/login')
      router.refresh()
    } catch { setError('Falha de comunicação com o servidor.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="py-16 text-center text-sm text-slate-500">Carregando seu espaço...</div>
  if (!user) return null

  const roleLabel = roleLabels[user.role] || user.role
  const store = user.storeProfile

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 pb-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-amber-50/45 to-orange-50/60 shadow-sm dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/25">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4 sm:gap-6">
            {user.avatarUrl ? <img src={user.avatarUrl} alt={`Foto de perfil de ${user.name}`} className="h-24 w-24 shrink-0 rounded-3xl object-cover shadow-lg ring-4 ring-white/80 dark:ring-slate-800 sm:h-28 sm:w-28" /> : <InitialAvatar name={user.name} />}
            <div className="min-w-0"><div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-300"><BadgeCheck className="h-3.5 w-3.5" /> Perfil ativo</div><h1 className="truncate text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">{user.name}</h1><p className="mt-1 text-sm font-bold text-amber-700 dark:text-amber-300">{roleLabel}</p><p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">{roleDescriptions[user.role] || 'Informações e preferências do seu perfil no PeçaAki.'}</p></div>
          </div>
          {!editing && <button type="button" onClick={startEditing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 shadow-md shadow-amber-500/20 transition hover:bg-amber-400"><Edit3 className="h-4 w-4" /> Editar dados</button>}
        </div>
      </section>

      {message && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />{message}</div>}
      {error && <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"><AlertCircle className="h-4 w-4" />{error}</div>}

      {!editing ? <>
        <section className="rounded-3xl border border-slate-200/80 bg-slate-50/65 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-6"><div className="mb-4 flex items-center gap-2"><UserRound className="h-5 w-5 text-amber-500" /><h2 className="text-lg font-black text-slate-900 dark:text-white">Informações pessoais</h2></div><div className="grid gap-3 sm:grid-cols-2"><DataItem icon={Mail} label="E-mail" value={user.email} /><DataItem icon={Phone} label="Telefone / WhatsApp" value={user.phone} /><DataItem icon={MapPin} label="Município" value={user.city} /><DataItem icon={MapPin} label="Bairro" value={user.neighborhood} /><DataItem icon={MapPin} label="Endereço completo" value={user.address} /><DataItem icon={MapPin} label="CEP" value={user.postalCode} /></div></section>
        {store && <section className="rounded-3xl border border-sky-200/80 bg-sky-50/55 p-5 shadow-sm dark:border-sky-900/70 dark:bg-sky-950/20 sm:p-6"><div className="mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-sky-600 dark:text-sky-300" /><h2 className="text-lg font-black text-slate-900 dark:text-white">Informações comerciais</h2>{store.isVerified && <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-300"><ShieldCheck className="h-4 w-4" /> Verificado</span>}</div><div className="grid gap-3 sm:grid-cols-2"><DataItem icon={Building2} label="Nome fantasia" value={store.fantasyName} /><DataItem icon={Building2} label="Razão social" value={store.companyName} /><DataItem icon={ShieldCheck} label="CNPJ / CPF" value={store.cnpjCpf} /><DataItem icon={MapPin} label="Endereço" value={store.address} /><DataItem icon={Phone} label="Telefone comercial" value={store.phone} /><DataItem icon={Building2} label="Categorias" value={formatList(store.categories)} /><DataItem icon={Building2} label="Marcas atendidas" value={formatList(store.vehicleBrands)} /></div></section>}
        <section className="rounded-3xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-900/50 dark:bg-rose-950/20 sm:p-6"><h2 className="text-sm font-black text-rose-700 dark:text-rose-300">Excluir conta</h2><p className="mt-1 text-xs leading-relaxed text-rose-700/80 dark:text-rose-300/80">A exclusão remove sua conta e os registros vinculados conforme as relações do sistema. Esta ação é permanente.</p><button type="button" onClick={handleDelete} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60 dark:border-rose-800 dark:bg-slate-950 dark:text-rose-300"><Trash2 className="h-4 w-4" /> Excluir minha conta</button></section>
      </> : <section className="rounded-3xl border border-amber-200/80 bg-white p-5 shadow-sm dark:border-amber-800/70 dark:bg-slate-900 sm:p-8"><div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800"><div><h2 className="text-xl font-black text-slate-900 dark:text-white">Editar dados cadastrais</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Atualize seus dados e salve quando concluir.</p></div><button type="button" onClick={cancelEditing} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"><X className="h-4 w-4" /> Cancelar</button></div><form onSubmit={handleSave} className="space-y-4"><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Nome e sobrenome</label><input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">E-mail</label><input disabled value={user.email} className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950" /><p className="mt-1 text-[11px] text-slate-500">O e-mail é o identificador da conta e não pode ser alterado aqui.</p></div><ProfileImageEditor value={avatarUrl} onChange={setAvatarUrl} /><div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Telefone / WhatsApp</label><input required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Município</label><select value={form.city} onChange={(event) => updateField('city', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option>São Luís</option><option>Paço do Lumiar</option><option>São José de Ribamar</option><option>Raposa</option></select></div></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Bairro</label><input required value={form.neighborhood} onChange={(event) => updateField('neighborhood', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">CEP</label><input value={form.postalCode} onChange={(event) => updateField('postalCode', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div></div><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Endereço completo</label><input required value={form.address} onChange={(event) => updateField('address', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div><div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center"><span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Perfil: {roleLabel}</span><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar alterações</button></div></form></section>}
    </div>
  )
}
