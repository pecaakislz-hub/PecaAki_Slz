'use client'

import { useEffect, useRef, useState } from 'react'
import { Clipboard, Crop, ImagePlus, Link as LinkIcon, Loader2, RotateCcw, Upload } from 'lucide-react'

type Props = { value?: string; onChange: (url: string) => void }

export default function ProfileImageEditor({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [source, setSource] = useState(value || '')
  const [url, setUrl] = useState('')
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const loadSource = (next: string) => {
    setError('')
    setSource(next)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setRotation(0)
  }

  const readFile = (file: Blob) => {
    if (!file.type.startsWith('image/')) return setError('Escolha um arquivo de imagem.')
    if (file.size > 8 * 1024 * 1024) return setError('A imagem deve ter no máximo 8 MB.')
    const reader = new FileReader()
    reader.onload = () => loadSource(String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleUrl = async () => {
    if (!url.trim()) return
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceUrl: url.trim() }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível carregar a imagem da internet.')
      loadSource(data.dataUrl || data.url)
      setUrl('')
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível carregar a imagem.') }
    finally { setBusy(false) }
  }

  const handleClipboard = async () => {
    setBusy(true); setError('')
    try {
      if (!navigator.clipboard?.read) throw new Error('Seu navegador não permitiu ler imagens da área de transferência.')
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const type = item.types.find((candidate) => candidate.startsWith('image/'))
        if (type) { readFile(await item.getType(type)); return }
      }
      throw new Error('Nenhuma imagem foi encontrada na área de transferência.')
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível ler a área de transferência.') }
    finally { setBusy(false) }
  }

  useEffect(() => {
    if (!source) return
    const image = new Image()
    image.onload = () => { imageRef.current = image; draw() }
    image.onerror = () => setError('Não foi possível abrir esta imagem.')
    image.src = source
  }, [source])

  useEffect(() => { draw() }, [zoom, offsetX, offsetY, rotation])

  const draw = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return
    const size = 320
    canvas.width = size; canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, size, size)
    context.save()
    context.translate(size / 2, size / 2)
    context.rotate((rotation * Math.PI) / 180)
    const scale = Math.max(size / image.width, size / image.height) * zoom
    context.drawImage(image, -image.width * scale / 2 + offsetX, -image.height * scale / 2 + offsetY, image.width * scale, image.height * scale)
    context.restore()
  }

  const applyCrop = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    onChange(canvas.toDataURL('image/jpeg', 0.88))
  }

  return <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
    <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-white"><ImagePlus className="h-4 w-4 text-amber-500" /> Imagem do perfil <span className="font-normal text-slate-500 dark:text-slate-400">(opcional)</span></div>
    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Use sua foto ou a logomarca da empresa. Você pode enviar do PC, colar uma imagem ou informar um endereço da internet.</p>
    <div className="grid gap-2 sm:grid-cols-3"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-amber-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"><Upload className="h-4 w-4" /> Do computador<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])} /></label><button type="button" onClick={handleClipboard} disabled={busy} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-amber-400 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"><Clipboard className="h-4 w-4" /> Área de transferência</button><div className="flex gap-1"><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /><button type="button" onClick={handleUrl} disabled={busy || !url.trim()} aria-label="Carregar imagem da internet" className="rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-700"><LinkIcon className="h-4 w-4" /></button></div></div>
    {busy && <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Carregando imagem...</div>}
    {error && <p className="rounded-lg bg-rose-50 p-2 text-[11px] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
    {source && <div className="grid gap-4 sm:grid-cols-[minmax(0,320px)_1fr] sm:items-center"><div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border-4 border-white bg-slate-200 shadow-md dark:border-slate-700 dark:bg-slate-950"><canvas ref={canvasRef} className="block aspect-square w-full" /><div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-white/80" /></div><div className="space-y-3 text-xs text-slate-700 dark:text-slate-200"><label className="block font-bold">Zoom <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full accent-amber-500" /></label><label className="block font-bold">Horizontal <input type="range" min="-120" max="120" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="mt-1 w-full accent-amber-500" /></label><label className="block font-bold">Vertical <input type="range" min="-120" max="120" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="mt-1 w-full accent-amber-500" /></label><div className="flex gap-2"><button type="button" onClick={() => setRotation((value) => (value + 90) % 360)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1.5 font-bold dark:border-slate-600"><RotateCcw className="h-3.5 w-3.5" /> Girar</button><button type="button" onClick={applyCrop} className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 font-black text-slate-950 hover:bg-amber-400"><Crop className="h-3.5 w-3.5" /> Aplicar recorte</button></div></div></div>}
    {value && <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-300">Imagem ajustada e pronta para o cadastro.</p>}
  </div>
}
