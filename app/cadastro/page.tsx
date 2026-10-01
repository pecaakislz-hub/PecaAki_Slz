'use client'

import { useEffect, useState, Suspense, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User, Store, Wrench, Truck, Mail, Phone, Lock, MapPin, Building, AlertCircle, ArrowRight, ShieldCheck, Car, Bike, Check } from 'lucide-react'
import ProfileImageEditor from '@/components/ProfileImageEditor'
import PasswordInput from '@/components/PasswordInput'

type Role = 'COMPRADOR' | 'VENDEDOR' | 'OFICINA' | 'GUINCHO'
const inputClass = 'w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
const commercialInputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white'

const scopeOptions = [{ value: 'CARRO', label: 'Carros' }, { value: 'MOTO', label: 'Motos' }]
const sizeOptions = [{ value: 'PEQUENO', label: 'Pequeno porte' }, { value: 'MEDIO', label: 'Médio porte' }, { value: 'GRANDE', label: 'Grande porte' }]
const productOptions = [{ value: 'PECAS', label: 'Peças' }, { value: 'ACESSORIOS', label: 'Acessórios' }, { value: 'BATERIAS', label: 'Baterias' }, { value: 'OLEOS_FILTROS', label: 'Óleos e filtros' }, { value: 'PNEUS', label: 'Pneus' }]
const conditionOptions = [{ value: 'NOVAS', label: 'Novas' }, { value: 'SEMINOVAS', label: 'Seminovas' }, { value: 'SUCATA', label: 'De sucata' }]

function TextField({ label, value, onChange, type = 'text', required = false, placeholder = '', className = inputClass }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string; className?: string }) {
  return <div><label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}{required && <span className="text-rose-500"> *</span>}</label><input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} /></div>
}

function CheckGroup({ title, options, values, onChange }: { title: string; options: { value: string; label: string }[]; values: string[]; onChange: (value: string) => void }) {
  return <fieldset><legend className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">{title}</legend><div className="grid gap-2 sm:grid-cols-3">{options.map((option) => { const selected = values.includes(option.value); return <label key={option.value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${selected ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'}`}><input type="checkbox" checked={selected} onChange={() => onChange(option.value)} className="sr-only" /> <span className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-300 dark:border-slate-600'}`}>{selected && <Check className="h-3 w-3" />}</span>{option.label}</label> })}</div></fieldset>
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"><h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">{icon}{title}</h3>{children}</section>
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<Role>('COMPRADOR')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('São Luís')
  const [neighborhood, setNeighborhood] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [fantasyName, setFantasyName] = useState('')
  const [cnpjCpf, setCnpjCpf] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [website, setWebsite] = useState('')
  const [scopes, setScopes] = useState<string[]>(['CARRO', 'MOTO'])
  const [sizes, setSizes] = useState<string[]>([])
  const [products, setProducts] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [addVehicle, setAddVehicle] = useState(false)
  const [vehicleType, setVehicleType] = useState<'CARRO' | 'MOTO'>('CARRO')
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehicleEngine, setVehicleEngine] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (['COMPRADOR', 'VENDEDOR', 'OFICINA', 'GUINCHO'].includes(roleParam || '')) setRole(roleParam as Role)
  }, [searchParams])

  const toggle = (values: string[], setValues: (values: string[]) => void, value: string) => setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])
  const isCommercial = role !== 'COMPRADOR'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    if (isCommercial && !scopes.length) { setError('Selecione se o perfil atende carros, motos ou ambos.'); setLoading(false); return }
    if (isCommercial && !sizes.length) { setError('Selecione pelo menos um porte de veículo atendido.'); setLoading(false); return }
    if (role === 'VENDEDOR' && (!products.length || !conditions.length)) { setError('Selecione os produtos comercializados e as condições das peças.'); setLoading(false); return }
    if (role === 'COMPRADOR' && addVehicle && (!vehicleBrand || !vehicleModel || !vehicleYear)) { setError('Preencha marca, modelo e ano para adicionar o veículo à Garagem Virtual.'); setLoading(false); return }
    try {
      const storeData = isCommercial ? {
        companyName, fantasyName, cnpjCpf, phone, city, neighborhood, address,
        categories: JSON.stringify(products), vehicleBrands: JSON.stringify(scopes),
        serviceScopes: JSON.stringify(scopes), vehicleSizes: JSON.stringify(sizes),
        productTypes: JSON.stringify(products), itemConditions: JSON.stringify(conditions),
        contactEmail: contactEmail || email,
        socialLinks: JSON.stringify({ instagram, facebook, website }),
      } : undefined
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, phone, role, city, neighborhood: neighborhood || 'Centro', address, postalCode, avatarUrl: avatarUrl || null, storeData, vehicleData: role === 'COMPRADOR' && addVehicle ? { type: vehicleType, brand: vehicleBrand, model: vehicleModel, year: vehicleYear, engine: vehicleEngine, plate: vehiclePlate } : undefined }) })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Erro ao realizar cadastro'); setLoading(false); return }
      router.push('/login?registered=1')
    } catch { setError('Falha na comunicação com o servidor'); setLoading(false) }
  }

  return <div className="mx-auto max-w-3xl px-4 py-8"><div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"><div className="space-y-2 text-center"><img src="/logo-pecaaki-slz.png" alt="PeçaAki Logo" className="mx-auto mb-2 h-14 w-auto object-contain drop-shadow-md sm:h-16" /><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Criar Conta no PeçaAki</h1><p className="text-xs text-slate-600 dark:text-slate-400">Selecione seu perfil e complete os dados necessários para usar a plataforma.</p></div>
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-4">{([['COMPRADOR', 'Comprador', User], ['VENDEDOR', 'Vendedor', Store], ['OFICINA', 'Oficina', Wrench], ['GUINCHO', 'Guincho', Truck]] as const).map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setRole(value)} className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-bold transition ${role === value ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}</div>
    {error && <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
    <form onSubmit={handleSubmit} className="space-y-5"><Section title="Dados de acesso e contato" icon={<User className="h-4 w-4" />}><div className="grid gap-4 sm:grid-cols-2"><TextField label={role === 'VENDEDOR' ? 'Nome do responsável' : 'Nome completo'} value={name} onChange={setName} required placeholder="Ex.: Carlos Eduardo" /><TextField label="WhatsApp / telefone" value={phone} onChange={setPhone} required placeholder="(98) 98888-7777" /><TextField label="E-mail de acesso" value={email} onChange={setEmail} type="email" required placeholder="seu.email@exemplo.com" /><div><label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Senha <span className="text-rose-500">*</span></label><PasswordInput required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className={inputClass} /></div></div></Section>
      <Section title="Endereço" icon={<MapPin className="h-4 w-4" />}><div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Município</label><select value={city} onChange={(event) => setCity(event.target.value)} className={inputClass}><option>São Luís</option><option>Paço do Lumiar</option><option>São José de Ribamar</option><option>Raposa</option></select></div><TextField label="CEP" value={postalCode} onChange={setPostalCode} placeholder="65000-000" /><TextField label="Bairro" value={neighborhood} onChange={setNeighborhood} required placeholder="Ex.: Alemanha" /><div className="sm:col-span-2"><TextField label="Endereço completo" value={address} onChange={setAddress} required placeholder="Rua, número, complemento" /></div></div></Section>
      <ProfileImageEditor value={avatarUrl} onChange={setAvatarUrl} />
      {role === 'COMPRADOR' && (
        <Section title="Garagem Virtual" icon={<Car className="h-4 w-4" />}>
          <div className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${addVehicle ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 via-orange-400/10 to-white shadow-lg shadow-amber-500/10 dark:from-amber-400/20 dark:via-orange-400/10 dark:to-slate-950' : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-950'}`}>
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${addVehicle ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-amber-600 dark:bg-slate-800 dark:text-amber-300'}`}>
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Monte sua Garagem Virtual</p>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-300">Cadastre um carro ou uma moto agora e deixe suas futuras cotações mais rápidas e precisas.</p>
                </div>
              </div>
              <button type="button" onClick={() => setAddVehicle((current) => !current)} aria-expanded={addVehicle} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition active:scale-[0.98] ${addVehicle ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200' : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400'}`}>
                <Car className="h-4 w-4" />{addVehicle ? 'Ocultar veículo' : 'Cadastrar veículo'}<ArrowRight className={`h-4 w-4 transition-transform ${addVehicle ? 'rotate-90' : ''}`} />
              </button>
            </div>
            {addVehicle && (
              <div className="relative mt-4 border-t border-amber-200/70 pt-4 dark:border-amber-800/50">
                <div className="mb-3 flex items-center gap-2 text-xs font-black text-amber-800 dark:text-amber-200"><Check className="h-4 w-4" />Veículo incluído no cadastro da sua conta</div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setVehicleType('CARRO')} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${vehicleType === 'CARRO' ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-200 dark:border-slate-700'}`}><Car className="mr-1 inline h-4 w-4" />Carro</button>
                    <button type="button" onClick={() => setVehicleType('MOTO')} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${vehicleType === 'MOTO' ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-200 dark:border-slate-700'}`}><Bike className="mr-1 inline h-4 w-4" />Moto</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Marca" value={vehicleBrand} onChange={setVehicleBrand} required placeholder="Chevrolet, Honda..." />
                    <TextField label="Modelo" value={vehicleModel} onChange={setVehicleModel} required placeholder="Onix, CG 160..." />
                    <TextField label="Ano" value={vehicleYear} onChange={setVehicleYear} required placeholder="2020" />
                    <TextField label="Motor" value={vehicleEngine} onChange={setVehicleEngine} placeholder="1.0 Flex" />
                    <TextField label="Placa (opcional)" value={vehiclePlate} onChange={setVehiclePlate} placeholder="PSL-1234" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}
      {isCommercial && <Section title={role === 'VENDEDOR' ? 'Dados comerciais e de atendimento' : role === 'OFICINA' ? 'Dados da oficina' : 'Dados do serviço de guincho'} icon={<Building className="h-4 w-4" />}><div className="grid gap-4 sm:grid-cols-2"><TextField label="Razão Social" value={companyName} onChange={setCompanyName} required placeholder="Razão social completa" className={commercialInputClass} /><TextField label="Nome Fantasia" value={fantasyName} onChange={setFantasyName} required placeholder="Nome que será exibido" className={commercialInputClass} /><TextField label="CNPJ ou CPF" value={cnpjCpf} onChange={setCnpjCpf} required placeholder="00.000.000/0001-00" className={commercialInputClass} /><TextField label="E-mail comercial" value={contactEmail} onChange={setContactEmail} type="email" placeholder={email || 'contato@empresa.com'} className={commercialInputClass} /></div><CheckGroup title={role === 'VENDEDOR' ? 'Comercializa peças para' : role === 'OFICINA' ? 'Atende veículos' : 'Reboca veículos'} options={scopeOptions} values={scopes} onChange={(value) => toggle(scopes, setScopes, value)} /><CheckGroup title={role === 'VENDEDOR' ? 'Porte dos carros para os quais oferece peças' : role === 'OFICINA' ? 'Porte dos carros atendidos' : 'Porte dos carros rebocados'} options={sizeOptions} values={sizes} onChange={(value) => toggle(sizes, setSizes, value)} />{role === 'VENDEDOR' && <><CheckGroup title="O que comercializa" options={productOptions} values={products} onChange={(value) => toggle(products, setProducts, value)} /><CheckGroup title="Condição das peças" options={conditionOptions} values={conditions} onChange={(value) => toggle(conditions, setConditions, value)} /></>}<div className="grid gap-4 sm:grid-cols-3"><TextField label="Instagram" value={instagram} onChange={setInstagram} placeholder="@suaempresa" className={commercialInputClass} /><TextField label="Facebook" value={facebook} onChange={setFacebook} placeholder="facebook.com/suaempresa" className={commercialInputClass} /><TextField label="Site / outra rede" value={website} onChange={setWebsite} placeholder="https://..." className={commercialInputClass} /></div></Section>}
      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />Ao se cadastrar, você concorda com nossos <Link href="/termos" className="text-amber-600 underline dark:text-amber-400">Termos</Link> e <Link href="/privacidade" className="text-amber-600 underline dark:text-amber-400">LGPD</Link>.</div><button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-50">{loading ? 'Salvando cadastro...' : 'Finalizar Cadastro'}<ArrowRight className="h-4 w-4" /></button></form><div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">Já possui conta? <Link href="/login" className="font-bold text-amber-600 hover:underline dark:text-amber-400">Fazer login</Link></div></div></div>
}

export default function RegisterPage() { return <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-8 text-sm text-slate-600">Carregando formulário...</div>}><RegisterContent /></Suspense> }
