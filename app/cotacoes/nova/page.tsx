'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Car, Camera, MapPin, Truck, CheckCircle2, AlertCircle, ArrowRight, UploadCloud, X } from 'lucide-react'

export default function NewQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehicleId, setVehicleId] = useState<string>('')
  const [vehicleText, setVehicleText] = useState<string>('')

  const [partName, setPartName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Motor')
  const [deliveryPreference, setDeliveryPreference] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY')
  
  // Municípios da Grande São Luís selecionados por padrão
  const [targetCities, setTargetCities] = useState<string[]>([
    'São Luís',
    'Paço do Lumiar',
    'São José de Ribamar',
    'Raposa'
  ])

  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Buscar veículos da garagem
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles)
          const preselected = searchParams.get('vehicleId')
          if (preselected && data.vehicles.some((v: any) => v.id === preselected)) {
            setVehicleId(preselected)
          } else {
            setVehicleId(data.vehicles[0].id)
          }
        }
      })
      .catch(() => {})
  }, [searchParams])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    if (photos.length >= 3) {
      alert('Você pode enviar no máximo 3 fotos da peça.')
      return
    }

    setUploading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setPhotos([...photos, data.url])
      } else {
        alert(data.error || 'Erro no upload da foto')
      }
    } catch (err) {
      alert('Falha ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  const toggleCity = (cityName: string) => {
    if (targetCities.includes(cityName)) {
      if (targetCities.length === 1) return // pelo menos 1 município
      setTargetCities(targetCities.filter((c) => c !== cityName))
    } else {
      setTargetCities([...targetCities, cityName])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicleId || null,
          vehicleText: vehicleId ? null : vehicleText,
          partName,
          description,
          category,
          deliveryPreference,
          targetCities,
          photos
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao publicar cotação')
        setLoading(false)
        return
      }

      router.push(`/cotacoes/${data.quote.id}`)
      router.refresh()
    } catch (err) {
      setError('Falha de conexão com o servidor')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* HEADER */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <PlusCircle className="w-4 h-4" /> Cotação Sob Demanda
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Solicitar Orçamento de Peça</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Preencha os detalhes e receba propostas das lojas de autopeças e motopeças da Grande São Luís em minutos.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEÇÃO 1: VEÍCULO */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" /> 1. Qual o Veículo?
          </h3>

          {vehicles.length > 0 ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Selecione da sua Garagem Virtual:</label>
              <select
                value={vehicleId}
                onChange={(e) => {
                  setVehicleId(e.target.value)
                  if (e.target.value) setVehicleText('')
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.year}) - Motor {v.engine || 'N/I'} {v.plate ? `[${v.plate}]` : ''}
                  </option>
                ))}
                <option value="">+ Outro veículo (Informar manualmente)</option>
              </select>
            </div>
          ) : null}

          {(!vehicleId || vehicles.length === 0) && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Marca, Modelo, Ano e Motorização
              </label>
              <input
                type="text"
                required={!vehicleId}
                value={vehicleText}
                onChange={(e) => setVehicleText(e.target.value)}
                placeholder="Ex: Fiat Uno Way 1.0 2014 Flex"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>

        {/* SEÇÃO 2: DETALHES DA PEÇA E FOTO */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" /> 2. Qual a Peça Necessária?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Peça</label>
              <input
                type="text"
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Ex: Par de discos de freio ventilados / Kit Embreagem"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Motor">Motor</option>
                <option value="Suspensão">Suspensão</option>
                <option value="Freios">Freios</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Transmissão">Transmissão</option>
                <option value="Lataria">Lataria</option>
                <option value="Vidros">Vidros</option>
                <option value="Pneus">Pneus</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Geral">Geral / Diversos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descrição detalhada (lado, preferências de marca, se aceita peça usada/similar)
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Preciso do amortecedor dianteiro lado direito. Dou preferência para peças novas com garantia, mas aceito recondicionada em bom estado."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Upload de Fotos */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Fotos da peça danificada ou etiqueta (Até 3 fotos)
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              {photos.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                  <img src={url} alt="Foto da peça" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {photos.length < 3 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500 bg-slate-950 flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 cursor-pointer transition-colors">
                  <UploadCloud className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold">{uploading ? 'Enviando...' : 'Anexar'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: PREFERÊNCIA DE ENTREGA E MUNICÍPIOS */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" /> 3. Entrega & Região na Grande São Luís
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Como prefere receber a peça?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryPreference('DELIVERY')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border text-left transition-all ${
                  deliveryPreference === 'DELIVERY'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-extrabold text-sm">
                  <Truck className="w-4 h-4" /> Entrega no Bairro (Motoboy)
                </div>
                <div className="text-[11px] font-normal opacity-80">Lojista entrega no seu endereço</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryPreference('PICKUP')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border text-left transition-all ${
                  deliveryPreference === 'PICKUP'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-extrabold text-sm">
                  <MapPin className="w-4 h-4" /> Retirada no Balcão da Loja
                </div>
                <div className="text-[11px] font-normal opacity-80">Você busca na loja mais próxima</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Municípios-alvo para envio das notificações na Ilha:
            </label>
            <div className="flex flex-wrap gap-2">
              {['São Luís', 'Paço do Lumiar', 'São José de Ribamar', 'Raposa'].map((cityName) => (
                <button
                  type="button"
                  key={cityName}
                  onClick={() => toggleCity(cityName)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    targetCities.includes(cityName)
                      ? 'bg-slate-800 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${targetCities.includes(cityName) ? 'text-amber-400' : 'text-slate-700'}`} />
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {loading ? 'Publicando Cotação...' : 'Publicar Cotação na Grande São Luís'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
