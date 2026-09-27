'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, Loader2, Save, ShieldCheck, Trash2, UserRound } from 'lucide-react'

type AccountUser = { id: string; name: string; email: string; phone: string; city: string; neighborhood: string; role: string }

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<AccountUser | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', city: 'São Luís', neighborhood: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok || !data.user) {
          router.replace('/login')
          return
        }
        setUser(data.user)
        setForm({ name: data.user.name || '', phone: data.user.phone || '', city: data.user.city || 'São Luís', neighborhood: data.user.neighborhood || '' })
      })
      .catch(() => setError('Não foi possível carregar seus dados.'))
      .finally(() => setLoading(false))
  }, [router])

  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/auth/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Não foi possível salvar os dados.'); return }
      setUser(data.user)
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

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><UserRound className="h-6 w-6" /></div>
          <div><h1 className="text-2xl font-black text-slate-900 dark:text-white">Dados Cadastrais</h1><p className="text-xs text-slate-500 dark:text-slate-400">Informações do espaço de {user.name}</p></div>
        </div>
        {message && <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />{message}</div>}
        {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"><AlertCircle className="h-4 w-4" />{error}</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Nome e sobrenome</label><input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">E-mail</label><input disabled value={user.email} className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950" /><p className="mt-1 text-[11px] text-slate-500">O e-mail é o identificador da conta e não pode ser alterado aqui.</p></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Telefone / WhatsApp</label><input required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div><div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Município</label><select value={form.city} onChange={(event) => updateField('city', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option>São Luís</option><option>Paço do Lumiar</option><option>São José de Ribamar</option><option>Raposa</option></select></div></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Bairro</label><input required value={form.neighborhood} onChange={(event) => updateField('neighborhood', event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div>
          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center"><span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Perfil: {user.role}</span><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar alterações</button></div>
        </form>
      </div>
      <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6 dark:border-rose-900/50 dark:bg-rose-950/20"><h2 className="text-sm font-black text-rose-700 dark:text-rose-300">Excluir conta</h2><p className="mt-1 text-xs leading-relaxed text-rose-700/80 dark:text-rose-300/80">A exclusão remove sua conta e os registros vinculados conforme as relações do sistema. Esta ação é permanente.</p><button type="button" onClick={handleDelete} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60 dark:border-rose-800 dark:bg-slate-950 dark:text-rose-300"><Trash2 className="h-4 w-4" /> Excluir minha conta</button></div>
    </div>
  )
}
