'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, LockKeyhole } from 'lucide-react'

function ResetContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (password !== confirmation) return setError('As senhas não coincidem.')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: params.get('token'), password }) })
      const data = await response.json()
      if (!response.ok) setError(data.error || 'Não foi possível redefinir a senha.')
      else { setSuccess(data.message); setTimeout(() => router.push('/login'), 1400) }
    } catch { setError('Falha de conexão com o servidor.') }
    finally { setLoading(false) }
  }

  return <div className="mx-auto max-w-md px-4 py-12"><div className="surface-panel space-y-6 rounded-3xl border p-6 shadow-xl sm:p-8"><div className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><LockKeyhole className="h-6 w-6" /></div><h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">Criar nova senha</h1><p className="mt-2 text-xs text-slate-600 dark:text-slate-200">Escolha uma senha com pelo menos 6 caracteres.</p></div>{success && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}{error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>}<form onSubmit={submit} className="space-y-4"><label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Nova senha<input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label><label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Confirme a nova senha<input required minLength={6} type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label><button disabled={loading || Boolean(success)} className="w-full rounded-xl bg-amber-500 py-3 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar nova senha'}</button></form><Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 hover:underline dark:text-amber-300"><ArrowLeft className="h-4 w-4" /> Voltar ao login</Link></div></div>
}

export default function ResetPasswordPage() { return <Suspense fallback={<div className="p-8 text-center text-sm">Carregando...</div>}><ResetContent /></Suspense> }
