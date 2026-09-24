'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Car, Wrench, Store, PlusCircle, User, LogOut, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white shadow-sm dark:shadow-slate-950/50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Marca Oficial */}
          <Link href="/" className="flex items-center gap-2 group py-1">
            <img
              src="/PeçaAki_Logomarca_SF.png"
              alt="PeçaAki Logo"
              className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span className="hidden sm:inline-block text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
              Grande São Luís - MA
            </span>
          </Link>

          {/* Links para Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={`hover:text-amber-500 dark:hover:text-amber-400 transition-colors ${pathname === '/' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
              Início
            </Link>

            {user?.role === 'COMPRADOR' && (
              <>
                <Link href="/garagem" className={`flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors ${pathname === '/garagem' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                  <Car className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  Minha Garagem
                </Link>
                <Link href="/cotacoes" className={`hover:text-amber-500 dark:hover:text-amber-400 transition-colors ${pathname === '/cotacoes' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                  Minhas Cotações
                </Link>
                <Link href="/cotacoes/nova" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg shadow-md hover:shadow-amber-500/30 transition-all">
                  <PlusCircle className="w-4 h-4" />
                  Pedir Peça
                </Link>
              </>
            )}

            {user?.role === 'LOJISTA' && (
              <>
                <Link href="/lojista/radar" className={`flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold ${pathname === '/lojista/radar' ? 'underline decoration-2 underline-offset-4' : ''}`}>
                  <Store className="w-4 h-4" />
                  Radar de Cotações (Ao Vivo)
                </Link>
                <Link href="/lojista/perfil" className={`hover:text-amber-500 dark:hover:text-amber-400 transition-colors ${pathname === '/lojista/perfil' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                  Minha Loja
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link href="/cotacoes/nova" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg shadow-md hover:shadow-amber-500/30 transition-all">
                  <PlusCircle className="w-4 h-4" />
                  Pedir Peça
                </Link>
                <Link href="/lojista/radar" className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400">
                  <Store className="w-4 h-4" />
                  Sou Lojista
                </Link>
              </>
            )}
          </nav>

          {/* Área de Perfil / Login e Botão de Tema */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle showLabel={false} />

            {user ? (
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-medium">
                    {user.role === 'LOJISTA' ? 'Lojista Credenciado' : 'Comprador'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sair da Conta"
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 text-sm font-medium">
                  Entrar
                </Link>
                <Link href="/cadastro" className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Botões Mobile (Tema + Menu Hamburger) */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle showLabel={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Alternar Aparência:</span>
            <ThemeToggle showLabel={true} />
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Início
          </Link>

          <Link
            href="/cotacoes/nova"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-bold bg-amber-500 text-slate-950"
          >
            <PlusCircle className="w-5 h-5" />
            Pedir Peça Agora
          </Link>

          {user?.role === 'COMPRADOR' && (
            <>
              <Link
                href="/garagem"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Car className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Minha Garagem Virtual
              </Link>
              <Link
                href="/cotacoes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Minhas Cotações
              </Link>
            </>
          )}

          <Link
            href="/lojista/radar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Store className="w-5 h-5" />
            Radar do Lojista (Ao Vivo)
          </Link>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{user.name}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 px-2.5 py-1 rounded"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 bg-amber-500 text-slate-950 font-bold rounded-lg"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
