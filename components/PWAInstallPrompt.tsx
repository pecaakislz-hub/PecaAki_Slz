'use client'

import { useState, useEffect } from 'react'
import { Download, WifiOff, X, Smartphone } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Monitorar status da conexão
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    if (!navigator.onLine) setIsOffline(true)

    // Capturar evento de instalação PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallBanner(false)
    }
    setDeferredPrompt(null)
  }

  return (
    <>
      {/* Banner de Status Offline */}
      {isOffline && (
        <div className="bg-rose-600 text-white text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-2 sticky top-16 z-40 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Você está no modo offline. As cotações salvas e visualizadas continuarão disponíveis.</span>
        </div>
      )}

      {/* Banner Flutuante PWA Install */}
      {showInstallBanner && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 z-50 flex items-center justify-between gap-3 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shrink-0">
              P⚡
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-1">
                Instalar PeçaAki
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">App</span>
              </h4>
              <p className="text-xs text-slate-300">Receba notificações de orçamentos direto no celular!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
