'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes, type ReactNode } from 'react'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  leftIcon?: ReactNode
}

export default function PasswordInput({ leftIcon, className = '', ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      {leftIcon && <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">{leftIcon}</span>}
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`w-full ${leftIcon ? 'pl-9' : ''} ${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        title={visible ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-slate-400 dark:hover:bg-slate-700/70 dark:hover:text-white"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  )
}
