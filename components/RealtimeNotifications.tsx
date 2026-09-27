'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BellRing, CheckCircle2, MessageCircle, X } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

type Toast = { id: string; title: string; message: string; link?: string | null; kind: 'notification' | 'purchase' }

export default function RealtimeNotifications() {
  const [toast, setToast] = useState<Toast | null>(null)
  const seen = useRef(new Set<string>())
  const initialised = useRef(false)

  useEffect(() => {
    let cancelled = false
    let pollTimer: ReturnType<typeof setInterval> | null = null
    let channel: ReturnType<NonNullable<ReturnType<typeof getSupabaseBrowserClient>>['channel']> | null = null
    const emit = (event: Toast) => {
      if (cancelled || seen.current.has(event.id)) return
      seen.current.add(event.id)
      setToast(event)
      window.dispatchEvent(new CustomEvent('pecaaki:realtime', { detail: event }))
      window.setTimeout(() => setToast((current) => current?.id === event.id ? null : current), 7000)
    }
    const loadSession = async () => {
      const sessionResponse = await fetch('/api/auth/me', { cache: 'no-store' })
      const session = await sessionResponse.json()
      if (cancelled || !session.user) return
      const supabase = getSupabaseBrowserClient()
      const readDashboard = async (notifyChanges: boolean) => {
        const response = await fetch('/api/user/dashboard', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        const notifications = data.dashboard?.notifications || []
        const purchases = data.dashboard?.purchases || []
        if (!initialised.current) {
          notifications.forEach((item: any) => seen.current.add(`notification:${item.id}`))
          purchases.forEach((item: any) => seen.current.add(`purchase:${item.id}:${item.status}`))
          initialised.current = true
          return
        }
        if (notifyChanges) {
          const latest = notifications[0]
          if (latest) emit({ id: `notification:${latest.id}`, title: latest.title, message: latest.message, link: latest.link, kind: latest.title.toLowerCase().includes('whatsapp') ? 'notification' : 'notification' })
        }
      }
      await readDashboard(false)
      if (supabase) {
        channel = supabase.channel(`pecaaki-user-${session.user.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Notification', filter: `userId=eq.${session.user.id}` }, (payload) => {
            const row: any = payload.new
            emit({ id: `notification:${row.id}`, title: row.title, message: row.message, link: row.link, kind: row.title?.toLowerCase().includes('whatsapp') ? 'notification' : 'notification' })
            window.dispatchEvent(new CustomEvent('pecaaki:refresh-dashboard'))
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Purchase', filter: `userId=eq.${session.user.id}` }, (payload) => {
            const row: any = payload.new
            emit({ id: `purchase:${row.id}:${row.status}`, title: 'Pedido atualizado', message: `Seu pedido mudou para ${String(row.status).toLowerCase().replace('_', ' ')}.`, link: '/cotacoes?view=purchases', kind: 'purchase' })
            window.dispatchEvent(new CustomEvent('pecaaki:refresh-dashboard'))
          })
          .subscribe()
      } else {
        pollTimer = setInterval(() => readDashboard(true), 15000)
      }
    }
    loadSession().catch(() => {})
    return () => {
      cancelled = true
      if (pollTimer) clearInterval(pollTimer)
      if (channel) getSupabaseBrowserClient()?.removeChannel(channel)
    }
  }, [])

  if (!toast) return null
  return <div className="fixed bottom-5 right-4 z-[70] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-amber-200 bg-white p-4 shadow-2xl dark:border-amber-900/60 dark:bg-slate-900" role="status" aria-live="polite"><div className="flex items-start gap-3"><div className={`rounded-xl p-2 ${toast.kind === 'purchase' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{toast.kind === 'purchase' ? <CheckCircle2 className="h-5 w-5" /> : toast.title.toLowerCase().includes('whatsapp') ? <MessageCircle className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-black text-slate-900 dark:text-white">{toast.title}</p><button type="button" onClick={() => setToast(null)} aria-label="Fechar notificação" className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><X className="h-4 w-4" /></button></div><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{toast.message}</p>{toast.link && <Link href={toast.link} onClick={() => setToast(null)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline dark:text-amber-300">Abrir no painel <BellRing className="h-3.5 w-3.5" /></Link>}</div></div></div>
}
