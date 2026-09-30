'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, LockKeyhole } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

function ResetContent() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    try {
      const supabase = getSupabaseBrowserClient()
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession()
        if (mounted && data.session) setReady(true)
      }
      checkSession()
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return
        if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
      })
      return () => { mounted = false; listener.subscription.unsubscribe() }
    } catch {
      setError('O serviço de autenticação ainda não está configurado.')
      return () => { mounted = false }
    }
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!ready) return setError('Abra o link recebido por e-mail para liberar a redefinição.')
    if (password !== confirmation) return setError('As senhas não coincidem.')
    if (password.length < 6) return setError('A nova senha deve ter pelo menos 6 caracteres.')
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      if (!accessToken) throw new Error('A sessão de recuperação expirou. Solicite um novo link.')
      const syncResponse = await fetch('/api/auth/sync-supabase-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ password })
      })
      const syncData = await syncResponse.json()
      if (!syncResponse.ok) throw new Error(syncData.error || 'Não foi possível sincronizar a nova senha.')
      await supabase.auth.signOut()
      setSuccess('Senha redefinida com sucesso. Você já pode entrar com a nova senha.')
      setTimeout(() => router.push('/login'), 1400)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível redefinir a senha.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="mx-auto max-w-md px-4 py-12"><div className="surface-panel space-y-6 rounded-3xl border p-6 shadow-xl sm:p-8"><div className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><LockKeyhole className="h-6 w-6" /></div><h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">Criar nova senha</h1><p className="mt-2 text-xs text-slate-600 dark:text-slate-200">A redefinição será processada pelo Supabase com sua sessão segura.</p></div>{success && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}{error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>}<form onSubmit={submit} className="space-y-4"><label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Nova senha<input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label><label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Confirme a nova senha<input required minLength={6} type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label><button disabled={loading || Boolean(success) || !ready} className="w-full rounded-xl bg-amber-500 py-3 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:opacity-50">{loading ? 'Salvando...' : ready ? 'Salvar nova senha' : 'Aguardando link seguro...'}</button></form><Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 hover:underline dark:text-amber-300"><ArrowLeft className="h-4 w-4" /> Voltar ao login</Link></div></div>
}

export default function ResetPasswordPage() { return <Suspense fallback={<div className="p-8 text-center text-sm">Carregando...</div>}><ResetContent /></Suspense> }
