'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, ShoppingBag, Store, Truck, Wrench } from 'lucide-react'

const items = [
  { label: 'Início', href: '/', icon: Home, tone: 'text-slate-900 dark:text-white' },
  { label: 'Comprar', href: '/cotacoes/nova', icon: ShoppingBag, tone: 'text-sky-600 dark:text-sky-300' },
  { label: 'Vender', href: '/lojista/radar', icon: Store, tone: 'text-emerald-600 dark:text-emerald-300' },
  { label: 'Oficinas', href: '/cotacoes/nova?service=oficina', icon: Wrench, tone: 'text-amber-600 dark:text-amber-300' },
  { label: 'Guinchos', href: '/cotacoes/nova?service=guincho', icon: Truck, tone: 'text-violet-600 dark:text-violet-300' },
  { label: 'Guia', href: '/guias', icon: BookOpen, tone: 'text-orange-600 dark:text-orange-300' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Atalhos principais" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
        {items.map(({ label, href, icon: Icon, tone }) => {
          const active = href === '/' ? pathname === '/' : pathname === href.split('?')[0] || (label === 'Guia' && pathname.startsWith('/guias'))
          return <Link key={label} href={href} aria-current={active ? 'page' : undefined} className={`flex min-w-0 flex-col items-center justify-center rounded-xl px-0.5 py-1 transition hover:bg-slate-100 active:scale-90 dark:hover:bg-slate-800 ${active ? tone : 'text-slate-400 dark:text-slate-500'}`}><Icon className="mb-0.5 h-4 w-4" /><span className="truncate text-[9px] font-bold">{label}</span></Link>
        })}
      </div>
    </nav>
  )
}
