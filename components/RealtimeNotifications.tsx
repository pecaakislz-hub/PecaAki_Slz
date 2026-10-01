'use client'

import { useEffect, useRef } from 'react'

type EventNotification = { id: string; title: string; message: string; link?: string | null }

/** Mantém o polling interno; a interface visual é aberta pelo botão Notificações do Meu Espaço. */
export default function RealtimeNotifications() {
  const seen = useRef(new Set<string>())
  const initialised = useRef(false)

  useEffect(() => {
    let cancelled = false
    const emit = (event: EventNotification) => {
      if (cancelled || seen.current.has(event.id)) return
      seen.current.add(event.id)
      window.dispatchEvent(new CustomEvent('pecaaki:realtime', { detail: event }))
    }
    const readDashboard = async (notifyChanges: boolean) => {
      try {
        const sessionResponse = await fetch('/api/auth/me', { cache: 'no-store' })
        const session = await sessionResponse.json()
        if (cancelled || !session.user) return
        const response = await fetch('/api/user/dashboard', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        const notifications = data.dashboard?.notifications || []
        if (!initialised.current) {
          notifications.forEach((item: any) => seen.current.add(`notification:${item.id}`))
          initialised.current = true
          return
        }
        if (notifyChanges && notifications[0]) {
          const item = notifications[0]
          emit({ id: `notification:${item.id}`, title: item.title, message: item.message, link: item.link })
        }
      } catch {
        // O polling seguinte tenta novamente sem interromper a aplicação.
      }
    }
    readDashboard(false).catch(() => {})
    const timer = window.setInterval(() => readDashboard(true), 15000)
    return () => { cancelled = true; window.clearInterval(timer) }
  }, [])

  return null
}
