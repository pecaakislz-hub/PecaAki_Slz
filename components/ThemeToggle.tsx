'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface ThemeToggleProps {
  showLabel?: boolean
  className?: string
}

export default function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Renderiza espaço reservado no SSR para evitar inconsistência de renderização
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`} />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Mudar para Modo Dia (Claro)' : 'Mudar para Modo Noite (Escuro)'}
      aria-label={isDark ? 'Mudar para Modo Dia (Claro)' : 'Mudar para Modo Noite (Escuro)'}
      className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-200 border ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 shadow-sm'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-700 hover:bg-amber-500/20 shadow-sm'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
          {showLabel && <span className="text-xs font-bold text-amber-300">Modo Dia ☀️</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-800" />
          {showLabel && <span className="text-xs font-bold text-slate-800">Modo Noite 🌙</span>}
        </>
      )}
    </button>
  )
}
