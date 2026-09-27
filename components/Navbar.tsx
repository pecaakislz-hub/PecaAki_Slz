'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, FileText, LogIn, LogOut, Package, Settings, Star, UserRound, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

type UserSession = { id: string; name: string; email: string; role: string; storeProfile?: unknown }

const roleLabels: Record<string, string> = {
  COMPRADOR: 'Cliente comprador', VENDEDOR: 'Vendedor', LOJISTA: 'Vendedor',
  OFICINA: 'Oficina', GUINCHO: 'Guincho', ADMIN: 'Administrador',
}

export default function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [quotesOpen, setQuotesOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserMenuOpen(false)
    setQuotesOpen(false)
    router.push('/')
    router.refresh()
  }

  const closeMenu = () => { setUserMenuOpen(false); setQuotesOpen(false) }
  const menuButtonClass = 'w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 group" onClick={closeMenu}>
          <img src="/PeçaAki_Logomarca_SF.png" alt="PeçaAki Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105 sm:h-11" />
          <span className="hidden truncate text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 sm:inline-block">Grande São Luís - MA</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {loading ? <span className="h-9 w-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" aria-hidden="true" /> : user ? (
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60" title="Encerrar sessão">
              <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sair</span>
            </button>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-300">
              <LogIn className="h-4 w-4" /><span>Entrar</span>
            </Link>
          )}

          <div className="relative">
            <button type="button" onClick={() => { setUserMenuOpen((open) => !open); setQuotesOpen(false) }} aria-expanded={userMenuOpen} aria-label={user ? `Abrir espaço de ${user.name}` : 'Abrir espaço do usuário'} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${user ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/60' : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60'}`}>
              <UserRound className="h-4 w-4" /><span className="hidden max-w-[130px] truncate sm:inline">{user ? user.name : 'Usuário'}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 text-slate-800 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <div className="flex items-start justify-between border-b border-slate-100 px-4 pb-3 dark:border-slate-800">
                <div className="min-w-0"><p className="truncate text-sm font-black">{user ? user.name : 'Visitante'}</p><p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{user ? roleLabels[user.role] || user.role : 'Faça login para acessar seus recursos'}</p></div>
                <button type="button" onClick={closeMenu} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Fechar menu"><X className="h-4 w-4" /></button>
              </div>
              {user ? <>
                <div className="border-b border-slate-100 py-1 dark:border-slate-800">
                  <button type="button" onClick={() => setQuotesOpen((open) => !open)} className={`${menuButtonClass} justify-between`}><span className="flex items-center gap-2.5"><FileText className="h-4 w-4 text-amber-500" /> Orçamentos</span><ChevronRight className={`h-4 w-4 transition-transform ${quotesOpen ? 'rotate-90' : ''}`} /></button>
                  {quotesOpen && <div className="mx-3 mb-1 rounded-xl bg-slate-50 py-1 dark:bg-slate-950"><Link href="/cotacoes?view=requested" onClick={closeMenu} className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400">Solicitados</Link><Link href="/cotacoes?view=received" onClick={closeMenu} className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400">Recebidos</Link></div>}
                  <Link href="/cotacoes?view=purchases" onClick={closeMenu} className={menuButtonClass}><Package className="h-4 w-4 text-blue-500" /> Minhas Compras e Pedidos</Link>
                  <Link href="/cotacoes?view=reviews" onClick={closeMenu} className={menuButtonClass}><Star className="h-4 w-4 text-amber-500" /> Avaliações</Link>
                </div>
                <div className="py-1"><Link href="/conta" onClick={closeMenu} className={`${menuButtonClass} text-red-600 dark:text-red-400`}><Settings className="h-4 w-4" /> Dados Cadastrais</Link></div>
              </> : <div className="space-y-2 p-3"><Link href="/login" onClick={closeMenu} className="block rounded-xl bg-amber-500 px-4 py-2.5 text-center text-xs font-bold text-slate-950 hover:bg-amber-400">Entrar</Link><Link href="/cadastro" onClick={closeMenu} className="block rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Criar cadastro</Link></div>}
            </div>}
          </div>

          <ThemeToggle showLabel={false} />
        </div>
      </div>
    </header>
  )
}
