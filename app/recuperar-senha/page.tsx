'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Send, ShieldCheck } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const prepareResponse = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail })
      })
      const prepareData = await prepareResponse.json()
      if (!prepareResponse.ok) throw new Error(prepareData.error || 'Não foi possível iniciar a recuperação.')

      const supabase = getSupabaseBrowserClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/redefinir-senha`
      })
      if (resetError) throw resetError
      setMessage('Se o e-mail estiver cadastrado, o Supabase enviará as instruções de recuperação. Verifique sua caixa de entrada e a pasta de spam.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível iniciar a recuperação.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="mx-auto max-w-md px-4 py-12">
    <div className="surface-panel space-y-6 rounded-3xl border p-6 shadow-xl sm:p-8">
      <div className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><ShieldCheck className="h-6 w-6" /></div><h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">Recuperar senha</h1><p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200">Informe o e-mail da sua conta. O Supabase enviará um link seguro para criar uma nova senha.</p></div>
      {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">{message}</div>}
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>}
      <form onSubmit={submit} className="space-y-4"><label className="block text-xs font-bold text-slate-700 dark:text-slate-200">E-mail<div className="relative mt-1"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.email@exemplo.com" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></div></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar link de recuperação'} <Send className="h-4 w-4" /></button></form>
      <Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 hover:underline dark:text-amber-300"><ArrowLeft className="h-4 w-4" /> Voltar ao login</Link>
    </div>
  </div>
}
