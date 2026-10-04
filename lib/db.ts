import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// Interface de Banco de Dados Híbrido (Prisma + Fallback InMemory Seed para Grande São Luís)
export interface StoreProfileData {
  id: string
  userId: string
  companyName: string
  fantasyName: string
  cnpjCpf: string
  phone: string
  city: string
  neighborhood: string
  address: string
  categories: string
  vehicleBrands: string
  serviceScopes?: string
  vehicleSizes?: string
  productTypes?: string
  itemConditions?: string
  contactEmail?: string
  socialLinks?: string
  isVerified: boolean
  createdAt: Date
}

export interface UserData {
  id: string
  name: string
  email: string
  passwordHash: string
  avatarUrl?: string | null
  phone: string
  role: string // 'COMPRADOR', 'LOJISTA', 'ADMIN'
  city: string
  neighborhood: string
  address?: string
  postalCode?: string
  createdAt: Date
  storeProfile?: StoreProfileData | null
}

export interface VehicleData {
  id: string
  userId: string
  type: string // 'CARRO', 'MOTO'
  brand: string
  model: string
  year: string
  engine: string
  plate?: string | null
  createdAt: Date
}

export interface ProposalData {
  id: string
  quoteRequestId: string
  storeProfileId: string
  availability: string
  condition: string
  cashPrice: number
  installmentPrice?: number | null
  deliveryFee: number
  deliveryTime: string
  notes?: string | null
  photoUrl?: string | null
  status: string // 'PENDING', 'ACCEPTED', 'REJECTED'
  createdAt: Date
  storeProfile?: StoreProfileData
}

export interface QuoteRequestData {
  id: string
  userId: string
  vehicleId?: string | null
  vehicleText?: string | null
  partName: string
  description: string
  category: string
  deliveryPreference: string
  targetCities: string
  photos: string
  status: string // 'OPEN', 'ANSWERED', 'ACCEPTED', 'CLOSED'
  createdAt: Date
  updatedAt: Date
  vehicle?: VehicleData | null
  user?: Partial<UserData> | null
  proposals?: ProposalData[]
}

export interface PurchaseData {
  id: string
  userId: string
  quoteRequestId: string
  proposalId: string
  storeProfileId: string
  status: string
  totalPrice: number
  createdAt: Date
  updatedAt: Date
  quoteRequest?: QuoteRequestData | null
  proposal?: ProposalData | null
  storeProfile?: StoreProfileData | null
  review?: ReviewData | null
}

export interface ReviewData {
  id: string
  userId: string
  storeProfileId: string
  quoteRequestId: string
  proposalId: string
  purchaseId: string
  rating: number
  comment?: string | null
  createdAt: Date
  storeProfile?: StoreProfileData | null
  purchase?: PurchaseData | null
}

// Verifica se a conexão com o Supabase/PostgreSQL está configurada
const isPrismaConfigured = () => {
  const url = process.env.DATABASE_URL
  return Boolean(url && !url.includes('[YOUR-PASSWORD]') && !url.includes('sqlite'))
}

// ----------------------------------------------------
// BANCO DE DADOS EM MEMÓRIA PRÉ-POPULADO (GRANDE SÃO LUÍS)
// ----------------------------------------------------

const passwordHashMock = bcrypt.hashSync('123456', 10)

const storesMemory: StoreProfileData[] = [
  {
    id: 'store-1',
    userId: 'user-lojista-1',
    companyName: 'São Luís Auto Peças LTDA',
    fantasyName: 'São Luís Auto Peças',
    cnpjCpf: '12.345.678/0001-90',
    phone: '98988776655',
    city: 'São Luís',
    neighborhood: 'Alemanha',
    address: 'Av. dos Franceses, 1200 - Alemanha, São Luís - MA',
    categories: JSON.stringify(['Motor', 'Suspensão', 'Freios', 'Elétrica']),
    vehicleBrands: JSON.stringify(['Chevrolet', 'Volkswagen', 'Fiat', 'Hyundai', 'Ford', 'Toyota']),
    isVerified: true,
    createdAt: new Date('2026-01-10')
  },
  {
    id: 'store-2',
    userId: 'user-lojista-2',
    companyName: 'Motopeças do Ilha EIRELI',
    fantasyName: 'Motopeças do Ilha',
    cnpjCpf: '98.765.432/0001-10',
    phone: '98991223344',
    city: 'São Luís',
    neighborhood: 'Cohab',
    address: 'Av. Jerônimo de Albuquerque, 450 - Cohab, São Luís - MA',
    categories: JSON.stringify(['Transmissão', 'Motor Moto', 'Capacetes', 'Pneus', 'Freios']),
    vehicleBrands: JSON.stringify(['Honda', 'Yamaha', 'Shineray', 'BMW']),
    isVerified: true,
    createdAt: new Date('2026-02-01')
  },
  {
    id: 'store-3',
    userId: 'user-lojista-3',
    companyName: 'Desmanche Credenciado Maiobão LTDA',
    fantasyName: 'Desmanche Credenciado Maiobão',
    cnpjCpf: '45.678.910/0001-33',
    phone: '98981112233',
    city: 'Paço do Lumiar',
    neighborhood: 'Maiobão',
    address: 'Av. 13 de Maio, Quadra 10 - Maiobão, Paço do Lumiar - MA',
    categories: JSON.stringify(['Peças Usadas', 'Lataria', 'Vidros', 'Faróis', 'Rodas']),
    vehicleBrands: JSON.stringify(['Chevrolet', 'Fiat', 'Volkswagen', 'Honda', 'Hyundai', 'Renault']),
    isVerified: true,
    createdAt: new Date('2026-02-15')
  }
]

const usersMemory: UserData[] = [
  {
    id: 'user-lojista-1',
    name: 'Roberto Alemanha',
    email: 'alemanha@pecaaki.com.br',
    passwordHash: passwordHashMock,
    phone: '98988776655',
    role: 'LOJISTA',
    city: 'São Luís',
    neighborhood: 'Alemanha',
    createdAt: new Date('2026-01-10'),
    storeProfile: storesMemory[0]
  },
  {
    id: 'user-lojista-2',
    name: 'Marcos Cohab',
    email: 'cohab@pecaaki.com.br',
    passwordHash: passwordHashMock,
    phone: '98991223344',
    role: 'LOJISTA',
    city: 'São Luís',
    neighborhood: 'Cohab',
    createdAt: new Date('2026-02-01'),
    storeProfile: storesMemory[1]
  },
  {
    id: 'user-lojista-3',
    name: 'Raimundo Maiobão',
    email: 'maiobao@pecaaki.com.br',
    passwordHash: passwordHashMock,
    phone: '98981112233',
    role: 'LOJISTA',
    city: 'Paço do Lumiar',
    neighborhood: 'Maiobão',
    createdAt: new Date('2026-02-15'),
    storeProfile: storesMemory[2]
  },
  {
    id: 'user-comprador-1',
    name: 'Carlos Eduardo (Motorista App)',
    email: 'carlos.app@gmail.com',
    passwordHash: passwordHashMock,
    phone: '98998887766',
    role: 'COMPRADOR',
    city: 'São Luís',
    neighborhood: 'Cohafuma',
    createdAt: new Date('2026-03-01')
  },
  {
    id: 'user-comprador-2',
    name: 'Sérgio Mecânico',
    email: 'sergio.mecanico@gmail.com',
    passwordHash: passwordHashMock,
    phone: '98987776655',
    role: 'COMPRADOR',
    city: 'São Luís',
    neighborhood: 'Renascença',
    createdAt: new Date('2026-03-02')
  }
]

const vehiclesMemory: VehicleData[] = [
  {
    id: 'veh-1',
    userId: 'user-comprador-1',
    type: 'CARRO',
    brand: 'Chevrolet',
    model: 'Onix Hatch LT 1.0 Flex',
    year: '2020',
    engine: '1.0 12V Flex',
    plate: 'PSL-4090',
    createdAt: new Date('2026-03-01')
  },
  {
    id: 'veh-2',
    userId: 'user-comprador-2',
    type: 'MOTO',
    brand: 'Honda',
    model: 'CG 160 Fan ESDI',
    year: '2022',
    engine: '160cc',
    plate: 'ROX-1E99',
    createdAt: new Date('2026-03-02')
  }
]

const proposalsMemory: ProposalData[] = [
  {
    id: 'prop-1',
    quoteRequestId: 'quote-1',
    storeProfileId: 'store-1',
    availability: 'IN_STOCK',
    condition: 'NEW',
    cashPrice: 420.00,
    installmentPrice: 460.00,
    deliveryFee: 15.00,
    deliveryTime: 'Até 2 horas (Motoboy próprio)',
    notes: 'Amortecedores Cofap TurboGás originais com 2 anos de garantia direto na loja da Alemanha.',
    status: 'PENDING',
    createdAt: new Date('2026-03-03T10:30:00'),
    storeProfile: storesMemory[0]
  },
  {
    id: 'prop-2',
    quoteRequestId: 'quote-1',
    storeProfileId: 'store-3',
    availability: 'IN_STOCK',
    condition: 'USED',
    cashPrice: 280.00,
    installmentPrice: 310.00,
    deliveryFee: 20.00,
    deliveryTime: 'Até 3 horas (Motoboy Maiobão)',
    notes: 'Par de amortecedores originais seminovos testados com garantia de 3 meses.',
    status: 'PENDING',
    createdAt: new Date('2026-03-03T11:15:00'),
    storeProfile: storesMemory[2]
  }
]

const quotesMemory: QuoteRequestData[] = [
  {
    id: 'quote-1',
    userId: 'user-comprador-1',
    vehicleId: 'veh-1',
    partName: 'Par de Amortecedores Dianteiros',
    description: 'Preciso do par de amortecedores dianteiros para Onix 2020. Preferência por Cofap ou Kayaba com coxins.',
    category: 'Suspensão',
    deliveryPreference: 'DELIVERY',
    targetCities: JSON.stringify(['São Luís', 'Paço do Lumiar', 'São José de Ribamar']),
    photos: JSON.stringify([]),
    status: 'ANSWERED',
    createdAt: new Date('2026-03-03T09:00:00'),
    updatedAt: new Date('2026-03-03T11:15:00'),
    vehicle: vehiclesMemory[0],
    user: { name: 'Carlos Eduardo', city: 'São Luís', neighborhood: 'Cohafuma' },
    proposals: [proposalsMemory[0], proposalsMemory[1]]
  },
  {
    id: 'quote-2',
    userId: 'user-comprador-2',
    vehicleId: 'veh-2',
    partName: 'Kit Relação (Corrente, Coroa e Pinhão) com Retentor',
    description: 'Kit de transmissão completo reforçado para CG 160 Fan 2022. Marca KMC ou DID.',
    category: 'Transmissão',
    deliveryPreference: 'PICKUP',
    targetCities: JSON.stringify(['São Luís', 'Paço do Lumiar']),
    photos: JSON.stringify([]),
    status: 'OPEN',
    createdAt: new Date('2026-03-04T14:20:00'),
    updatedAt: new Date('2026-03-04T14:20:00'),
    vehicle: vehiclesMemory[1],
    user: { name: 'Sérgio Mecânico', city: 'São Luís', neighborhood: 'Renascença' },
    proposals: []
  }
]

const purchasesMemory: PurchaseData[] = []
const reviewsMemory: ReviewData[] = []
const notificationsMemory: Array<{ id: string; userId: string; title: string; message: string; link?: string | null; read: boolean; createdAt: Date }> = []

// ----------------------------------------------------
// OPERAÇÕES DO BANCO DE DADOS HÍBRIDO
// ----------------------------------------------------

export const db = {
  // Usuários
  findUserByEmail: async (email: string) => {
    if (isPrismaConfigured()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { storeProfile: true }
        })
        if (user) return user
      } catch (e) {
        console.warn('Prisma query error, fallback to memory:', e)
      }
    }
    return usersMemory.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  },

  findUserById: async (id: string) => {
    if (isPrismaConfigured()) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          include: { storeProfile: true }
        })
        if (user) return user
      } catch (e) {
        console.warn('Prisma query error, fallback to memory:', e)
      }
    }
    return usersMemory.find((u) => u.id === id) || null
  },

  updateUser: async (id: string, data: any) => {
    if (isPrismaConfigured()) {
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.phone !== undefined ? { phone: data.phone } : {}),
            ...(data.city !== undefined ? { city: data.city } : {}),
            ...(data.neighborhood !== undefined ? { neighborhood: data.neighborhood } : {}),
            ...(data.address !== undefined ? { address: data.address } : {}),
            ...(data.postalCode !== undefined ? { postalCode: data.postalCode } : {}),
            ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
          },
          include: { storeProfile: true },
        })
        if (data.storeProfile && updated.storeProfile) {
          await prisma.storeProfile.update({ where: { id: updated.storeProfile.id }, data: {
            ...(data.storeProfile.companyName !== undefined ? { companyName: data.storeProfile.companyName } : {}),
            ...(data.storeProfile.fantasyName !== undefined ? { fantasyName: data.storeProfile.fantasyName } : {}),
            ...(data.storeProfile.cnpjCpf !== undefined ? { cnpjCpf: data.storeProfile.cnpjCpf } : {}),
            ...(data.storeProfile.phone !== undefined ? { phone: data.storeProfile.phone } : {}),
            ...(data.storeProfile.city !== undefined ? { city: data.storeProfile.city } : {}),
            ...(data.storeProfile.neighborhood !== undefined ? { neighborhood: data.storeProfile.neighborhood } : {}),
            ...(data.storeProfile.address !== undefined ? { address: data.storeProfile.address } : {}),
            ...(data.storeProfile.categories !== undefined ? { categories: data.storeProfile.categories } : {}),
            ...(data.storeProfile.vehicleBrands !== undefined ? { vehicleBrands: data.storeProfile.vehicleBrands } : {}),
            ...(data.storeProfile.serviceScopes !== undefined ? { serviceScopes: data.storeProfile.serviceScopes } : {}),
            ...(data.storeProfile.vehicleSizes !== undefined ? { vehicleSizes: data.storeProfile.vehicleSizes } : {}),
            ...(data.storeProfile.productTypes !== undefined ? { productTypes: data.storeProfile.productTypes } : {}),
            ...(data.storeProfile.itemConditions !== undefined ? { itemConditions: data.storeProfile.itemConditions } : {}),
            ...(data.storeProfile.contactEmail !== undefined ? { contactEmail: data.storeProfile.contactEmail } : {}),
            ...(data.storeProfile.socialLinks !== undefined ? { socialLinks: data.storeProfile.socialLinks } : {}),
          } })
        }
        return await prisma.user.findUnique({ where: { id }, include: { storeProfile: true } })
      } catch (e) {
        console.warn('Prisma update user error, fallback to memory:', e)
      }
    }
    const user = usersMemory.find((item) => item.id === id)
    if (!user) return null
    Object.assign(user, data)
    if (data.storeProfile && user.storeProfile) Object.assign(user.storeProfile, data.storeProfile)
    return user
  },
  deleteUser: async (id: string) => {
    if (isPrismaConfigured()) {
      try {
        await prisma.user.delete({ where: { id } })
        return true
      } catch (e) {
        console.warn('Prisma delete user error, fallback to memory:', e)
      }
    }
    const index = usersMemory.findIndex((item) => item.id === id)
    if (index < 0) return false
    usersMemory.splice(index, 1)
    return true
  },
  createUser: async (data: any) => {
    if (isPrismaConfigured()) {
      try {
        const created = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email.toLowerCase(),
            passwordHash: data.passwordHash,
            avatarUrl: data.avatarUrl || null,
            phone: data.phone,
            role: data.role || 'COMPRADOR',
            city: data.city || 'São Luís',
            neighborhood: data.neighborhood || 'Centro',
            address: data.address || '',
            postalCode: data.postalCode || '',
            ...(['LOJISTA', 'VENDEDOR', 'OFICINA', 'GUINCHO'].includes(data.role) && data.storeProfile ? {
              storeProfile: {
                create: {
                  companyName: data.storeProfile.companyName || data.name,
                  fantasyName: data.storeProfile.fantasyName || data.name,
                  cnpjCpf: data.storeProfile.cnpjCpf || '',
                  phone: data.storeProfile.phone || data.phone,
                  city: data.storeProfile.city || data.city,
                  neighborhood: data.storeProfile.neighborhood || data.neighborhood,
                  address: data.storeProfile.address || '',
                  categories: data.storeProfile.categories || JSON.stringify(['Auto', 'Moto']),
                  vehicleBrands: data.storeProfile.vehicleBrands || JSON.stringify(['Chevrolet', 'Fiat', 'Honda']),
                  serviceScopes: data.storeProfile.serviceScopes || JSON.stringify([]),
                  vehicleSizes: data.storeProfile.vehicleSizes || JSON.stringify([]),
                  productTypes: data.storeProfile.productTypes || JSON.stringify([]),
                  itemConditions: data.storeProfile.itemConditions || JSON.stringify([]),
                  contactEmail: data.storeProfile.contactEmail || data.email,
                  socialLinks: data.storeProfile.socialLinks || JSON.stringify({}),
                  isVerified: true
                },
              },
            } : {}),
            ...(data.vehicleData ? {
              vehicles: {
                create: {
                  type: data.vehicleData.type || 'CARRO',
                  brand: data.vehicleData.brand,
                  model: data.vehicleData.model,
                  year: String(data.vehicleData.year),
                  engine: data.vehicleData.engine || '',
                  plate: data.vehicleData.plate || null,
                },
              }
            } : {})
          },
          include: { storeProfile: true }
        })
        return created
      } catch (e) {
        console.warn('Prisma create user error, fallback to memory:', e)
      }
    }

    const newUser: UserData = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      avatarUrl: data.avatarUrl || null,
      phone: data.phone,
      role: data.role || 'COMPRADOR',
      city: data.city || 'São Luís',
      neighborhood: data.neighborhood || 'Centro',
      address: data.address || '',
      postalCode: data.postalCode || '',
      createdAt: new Date()
    }

    if (['LOJISTA', 'VENDEDOR', 'OFICINA', 'GUINCHO'].includes(data.role) && data.storeProfile) {
      const newStore: StoreProfileData = {
        id: `store-${Date.now()}`,
        userId: newUser.id,
        companyName: data.storeProfile.companyName || data.name,
        fantasyName: data.storeProfile.fantasyName || data.name,
        cnpjCpf: data.storeProfile.cnpjCpf || '',
        phone: data.storeProfile.phone || data.phone,
        city: data.storeProfile.city || data.city,
        neighborhood: data.storeProfile.neighborhood || data.neighborhood,
        address: data.storeProfile.address || '',
        categories: data.storeProfile.categories || JSON.stringify(['Auto', 'Moto']),
        vehicleBrands: data.storeProfile.vehicleBrands || JSON.stringify(['Chevrolet', 'Fiat', 'Honda']),
        serviceScopes: data.storeProfile.serviceScopes || JSON.stringify([]),
        vehicleSizes: data.storeProfile.vehicleSizes || JSON.stringify([]),
        productTypes: data.storeProfile.productTypes || JSON.stringify([]),
        itemConditions: data.storeProfile.itemConditions || JSON.stringify([]),
        contactEmail: data.storeProfile.contactEmail || data.email,
        socialLinks: data.storeProfile.socialLinks || JSON.stringify({}),
        isVerified: true,
        createdAt: new Date()
      }
      newUser.storeProfile = newStore
      storesMemory.push(newStore)
    }

    if (data.vehicleData) {
      vehiclesMemory.unshift({
        id: `veh-${Date.now()}`,
        userId: newUser.id,
        type: data.vehicleData.type || 'CARRO',
        brand: data.vehicleData.brand,
        model: data.vehicleData.model,
        year: String(data.vehicleData.year),
        engine: data.vehicleData.engine || '',
        plate: data.vehicleData.plate || null,
        createdAt: new Date()
      })
    }

    usersMemory.push(newUser)
    return newUser
  },

  updateUserPasswordByEmail: async (email: string, passwordHash: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (isPrismaConfigured()) {
      try {
        const result = await prisma.user.updateMany({ where: { email: normalizedEmail }, data: { passwordHash } })
        if (result.count > 0) return true
      } catch (e) {
        console.warn('Prisma update user password error, fallback to memory:', e)
      }
    }
    const user = usersMemory.find((entry) => entry.email.toLowerCase() === normalizedEmail)
    if (!user) return false
    user.passwordHash = passwordHash
    return true
  },

  // Veículos
  findVehiclesByUserId: async (userId: string) => {
    if (isPrismaConfigured()) {
      try {
        return await prisma.vehicle.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        })
      } catch (e) {
        console.warn('Prisma query error, fallback to memory:', e)
      }
    }
    return vehiclesMemory.filter((v) => v.userId === userId)
  },

  createVehicle: async (data: any) => {
    if (isPrismaConfigured()) {
      try {
        return await prisma.vehicle.create({
          data: {
            userId: data.userId,
            type: data.type || 'CARRO',
            brand: data.brand,
            model: data.model,
            year: String(data.year),
            engine: data.engine || '',
            plate: data.plate || null
          }
        })
      } catch (e) {
        console.warn('Prisma create vehicle error, fallback to memory:', e)
      }
    }

    const newVehicle: VehicleData = {
      id: `veh-${Date.now()}`,
      userId: data.userId,
      type: data.type || 'CARRO',
      brand: data.brand,
      model: data.model,
      year: String(data.year),
      engine: data.engine || '',
      plate: data.plate || null,
      createdAt: new Date()
    }
    vehiclesMemory.unshift(newVehicle)
    return newVehicle
  },

  // Cotações
  findQuotes: async (filter?: { userId?: string; scope?: string; category?: string }) => {
    if (isPrismaConfigured()) {
      try {
        const whereClause: any = {}
        if (filter?.userId) whereClause.userId = filter.userId
        if (filter?.category && filter.category !== 'Todas') whereClause.category = filter.category
        if (filter?.scope === 'radar') whereClause.status = { not: 'CLOSED' }

        const quotes = await prisma.quoteRequest.findMany({
          where: whereClause,
          include: {
            vehicle: true,
            user: { select: { name: true, city: true, neighborhood: true } },
            proposals: { include: { storeProfile: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
        return quotes.map((quote) => ({ ...quote, competitorCount: new Set(quote.proposals.map((proposal) => proposal.storeProfileId)).size }))
      } catch (e) {
        console.warn('Prisma query error, fallback to memory:', e)
      }
    }

    let result = [...quotesMemory]
    if (filter?.userId) {
      result = result.filter((q) => q.userId === filter.userId)
    }
    if (filter?.category && filter.category !== 'Todas') {
      result = result.filter((q) => q.category === filter.category)
    }
    if (filter?.scope === 'radar') result = result.filter((q) => q.status !== 'CLOSED')
    return result.map((quote) => ({ ...quote, competitorCount: new Set((quote.proposals || []).map((proposal) => proposal.storeProfileId)).size }))
  },

  findQuoteById: async (id: string) => {
    if (isPrismaConfigured()) {
      try {
        const quote = await prisma.quoteRequest.findUnique({
          where: { id },
          include: {
            vehicle: true,
            user: { select: { name: true, city: true, neighborhood: true } },
            proposals: { include: { storeProfile: true } }
          }
        })
        if (quote) return quote
      } catch (e) {
        console.warn('Prisma query error, fallback to memory:', e)
      }
    }
    return quotesMemory.find((q) => q.id === id) || null
  },

  createQuote: async (data: any) => {
    if (isPrismaConfigured()) {
      try {
        const quote = await prisma.quoteRequest.create({
          data: {
            userId: data.userId,
            vehicleId: data.vehicleId || null,
            vehicleText: data.vehicleText || null,
            partName: data.partName,
            description: data.description,
            category: data.category || 'Geral',
            deliveryPreference: data.deliveryPreference || 'DELIVERY',
            targetCities: JSON.stringify(data.targetCities || ['São Luís', 'Paço do Lumiar', 'São José de Ribamar', 'Raposa']),
            photos: JSON.stringify(data.photos || []),
            status: 'OPEN'
          },
          include: {
            vehicle: true,
            user: { select: { name: true, city: true, neighborhood: true } },
            proposals: true
          }
        })
        const providerRole = data.category === 'Guincho' ? 'GUINCHO' : data.category === 'Oficina' ? 'OFICINA' : null
        if (providerRole) {
          const cities = Array.isArray(data.targetCities) ? data.targetCities : ['São Luís', 'Paço do Lumiar', 'São José de Ribamar', 'Raposa']
          const providers = await prisma.user.findMany({ where: { role: providerRole }, select: { id: true, city: true, storeProfile: { select: { city: true } } } })
          const recipients = providers.filter((provider) => cities.includes(provider.storeProfile?.city || provider.city)).map((provider) => provider.id)
          if (recipients.length) await prisma.notification.createMany({ data: recipients.map((userId) => ({ userId, title: providerRole === 'GUINCHO' ? 'Novo pedido de guincho' : 'Novo atendimento de oficina', message: `Há uma nova solicitação de ${data.category.toLowerCase()} em ${cities.join(', ')}.`, link: providerRole === 'GUINCHO' ? '/guincho/radar' : '/cotacoes?view=serviceRequests' })) })
        }
        return quote
      } catch (e) {
        console.warn('Prisma create quote error, fallback to memory:', e)
      }
    }

    const user = usersMemory.find((u) => u.id === data.userId)
    let vehicle = vehiclesMemory.find((v) => v.id === data.vehicleId) || null

    const newQuote: QuoteRequestData = {
      id: `quote-${Date.now()}`,
      userId: data.userId,
      vehicleId: data.vehicleId || null,
      vehicleText: data.vehicleText || null,
      partName: data.partName,
      description: data.description,
      category: data.category || 'Geral',
      deliveryPreference: data.deliveryPreference || 'DELIVERY',
      targetCities: JSON.stringify(data.targetCities || ['São Luís', 'Paço do Lumiar', 'São José de Ribamar', 'Raposa']),
      photos: JSON.stringify(data.photos || []),
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
      vehicle,
      user: user ? { name: user.name, city: user.city, neighborhood: user.neighborhood } : null,
      proposals: []
    }

    quotesMemory.unshift(newQuote)
    const providerRole = data.category === 'Guincho' ? 'GUINCHO' : data.category === 'Oficina' ? 'OFICINA' : null
    if (providerRole) {
      const cities = Array.isArray(data.targetCities) ? data.targetCities : ['São Luís', 'Paço do Lumiar', 'São José de Ribamar', 'Raposa']
      usersMemory.filter((provider) => provider.role === providerRole && provider.id !== data.userId && cities.includes(provider.storeProfile?.city || provider.city)).forEach((provider) => notificationsMemory.unshift({ id: `notification-${Date.now()}-${provider.id}`, userId: provider.id, title: providerRole === 'GUINCHO' ? 'Novo pedido de guincho' : 'Novo atendimento de oficina', message: `Há uma nova solicitação de ${data.category.toLowerCase()} em ${cities.join(', ')}.`, link: providerRole === 'GUINCHO' ? '/guincho/radar' : '/cotacoes?view=serviceRequests', read: false, createdAt: new Date() }))
    }
    return newQuote
  },

  deleteQuote: async (quoteId: string, userId: string) => {
    if (isPrismaConfigured()) {
      try {
        const quote = await prisma.quoteRequest.findUnique({ where: { id: quoteId }, select: { userId: true, status: true } })
        if (!quote || quote.userId !== userId) throw new Error('NOT_ALLOWED')
        if (['ACCEPTED', 'CLOSED'].includes(quote.status)) throw new Error('QUOTE_CLOSED')
        await prisma.quoteRequest.delete({ where: { id: quoteId } })
        return { success: true }
      } catch (e: any) {
        if (e?.message === 'NOT_ALLOWED' || e?.message === 'QUOTE_CLOSED') throw e
        console.warn('Prisma delete quote error, fallback to memory:', e)
      }
    }
    const quote = quotesMemory.find((item) => item.id === quoteId)
    if (!quote || quote.userId !== userId) throw new Error('NOT_ALLOWED')
    if (['ACCEPTED', 'CLOSED'].includes(quote.status)) throw new Error('QUOTE_CLOSED')
    const quoteIndex = quotesMemory.findIndex((item) => item.id === quoteId)
    if (quoteIndex >= 0) quotesMemory.splice(quoteIndex, 1)
    for (let index = proposalsMemory.length - 1; index >= 0; index -= 1) {
      if (proposalsMemory[index].quoteRequestId === quoteId) proposalsMemory.splice(index, 1)
    }
    return { success: true }
  },

  // Propostas
  createProposal: async (data: any) => {
    if (isPrismaConfigured()) {
      try {
        const proposal = await prisma.proposal.create({
          data: {
            quoteRequestId: data.quoteRequestId,
            storeProfileId: data.storeProfileId,
            availability: data.availability,
            condition: data.condition,
            cashPrice: data.cashPrice,
            installmentPrice: data.installmentPrice || null,
            deliveryFee: data.deliveryFee || 0,
            deliveryTime: data.deliveryTime,
            notes: data.notes || null,
            photoUrl: data.photoUrl || null,
            status: 'PENDING'
          },
          include: { storeProfile: true, quoteRequest: true }
        })

        await prisma.quoteRequest.update({
          where: { id: data.quoteRequestId },
          data: { status: 'ANSWERED', updatedAt: new Date() }
        })

        await prisma.notification.create({
          data: {
            userId: proposal.quoteRequest.userId,
            title: 'Novo orçamento recebido',
            message: `${proposal.storeProfile.fantasyName} enviou uma proposta para ${proposal.quoteRequest.partName}.`,
            link: `/cotacoes/${proposal.quoteRequestId}`
          }
        })

        return proposal
      } catch (e) {
        console.warn('Prisma create proposal error, fallback to memory:', e)
      }
    }

    const store = storesMemory.find((s) => s.id === data.storeProfileId)
    const quote = quotesMemory.find((q) => q.id === data.quoteRequestId)

    const newProposal: ProposalData = {
      id: `prop-${Date.now()}`,
      quoteRequestId: data.quoteRequestId,
      storeProfileId: data.storeProfileId,
      availability: data.availability,
      condition: data.condition,
      cashPrice: data.cashPrice,
      installmentPrice: data.installmentPrice || null,
      deliveryFee: data.deliveryFee || 0,
      deliveryTime: data.deliveryTime,
      notes: data.notes || null,
      photoUrl: data.photoUrl || null,
      status: 'PENDING',
      createdAt: new Date(),
      storeProfile: store
    }

    proposalsMemory.push(newProposal)

    if (quote) {
      if (!quote.proposals) quote.proposals = []
      quote.proposals.push(newProposal)
      quote.status = 'ANSWERED'
      quote.updatedAt = new Date()
      notificationsMemory.unshift({ id: `notification-${Date.now()}`, userId: quote.userId, title: 'Novo orçamento recebido', message: `${store?.fantasyName || 'Uma loja'} enviou uma proposta para ${quote.partName}.`, link: `/cotacoes/${quote.id}`, read: false, createdAt: new Date() })
    }

    return newProposal
  },

  acceptProposal: async (proposalId: string, buyerId: string) => {
    if (isPrismaConfigured()) {
      try {
      return await prisma.$transaction(async (tx) => {
        const proposal = await tx.proposal.findUnique({ where: { id: proposalId }, include: { quoteRequest: true, storeProfile: { include: { user: { select: { role: true } } } } } })
        if (!proposal || proposal.quoteRequest.userId !== buyerId) throw new Error('NOT_ALLOWED')
        const existing = await tx.purchase.findUnique({ where: { quoteRequestId: proposal.quoteRequestId } })
        if (existing) return { proposal, purchase: existing }
        await tx.proposal.updateMany({ where: { quoteRequestId: proposal.quoteRequestId }, data: { status: 'REJECTED' } })
        const updatedProp = await tx.proposal.update({ where: { id: proposalId }, data: { status: 'ACCEPTED' } })
        await tx.quoteRequest.update({ where: { id: proposal.quoteRequestId }, data: { status: 'CLOSED', updatedAt: new Date() } })
        const purchase = await tx.purchase.create({ data: { userId: buyerId, quoteRequestId: proposal.quoteRequestId, proposalId, storeProfileId: proposal.storeProfileId, totalPrice: proposal.cashPrice + proposal.deliveryFee } })
        await tx.notification.create({ data: { userId: buyerId, title: 'Pedido criado', message: `Seu pedido de ${proposal.quoteRequest.partName} foi criado. Combine os próximos passos com a loja.`, link: `/cotacoes?view=purchases` } })
        await tx.notification.create({ data: { userId: proposal.storeProfile.userId, title: 'Proposta aceita', message: `Sua proposta para ${proposal.quoteRequest.partName} foi aceita pelo comprador.`, link: proposal.storeProfile.user.role === 'GUINCHO' ? '/guincho/radar' : '/cotacoes?view=realized' } })
        return { proposal: updatedProp, purchase }
      })
      } catch (e: any) {
        if (e?.message === 'NOT_ALLOWED') throw e
        console.warn('Prisma accept proposal error, fallback to memory:', e)
      }
    }
    const proposal = proposalsMemory.find((p) => p.id === proposalId)
    const quote = proposal && quotesMemory.find((q) => q.id === proposal.quoteRequestId)
    if (!proposal || !quote || quote.userId !== buyerId) throw new Error('NOT_ALLOWED')
    const existing = purchasesMemory.find((purchase) => purchase.quoteRequestId === quote.id)
    if (existing) return { proposal, purchase: existing }
    proposalsMemory.filter((item) => item.quoteRequestId === quote.id).forEach((item) => { item.status = item.id === proposalId ? 'ACCEPTED' : 'REJECTED' })
    proposal.status = 'ACCEPTED'; quote.status = 'CLOSED'; quote.updatedAt = new Date()
    const purchase: PurchaseData = { id: `purchase-${Date.now()}`, userId: buyerId, quoteRequestId: quote.id, proposalId, storeProfileId: proposal.storeProfileId, status: 'PENDING_CONTACT', totalPrice: proposal.cashPrice + proposal.deliveryFee, createdAt: new Date(), updatedAt: new Date(), quoteRequest: quote, proposal, storeProfile: proposal.storeProfile }
    purchasesMemory.unshift(purchase)
    notificationsMemory.unshift({ id: `notification-${Date.now()}`, userId: buyerId, title: 'Pedido criado', message: `Seu pedido de ${quote.partName} foi criado. Combine os próximos passos com a loja.`, link: '/cotacoes?view=purchases', read: false, createdAt: new Date() })
    if (proposal.storeProfile) { const storeUser = usersMemory.find((item) => item.id === proposal.storeProfile?.userId); notificationsMemory.unshift({ id: `notification-${Date.now() + 1}`, userId: proposal.storeProfile.userId, title: 'Proposta aceita', message: `Sua proposta para ${quote.partName} foi aceita pelo comprador.`, link: storeUser?.role === 'GUINCHO' ? '/guincho/radar' : '/cotacoes?view=realized', read: false, createdAt: new Date() }) }
    return { proposal, purchase }
  },

  getUserDashboard: async (userId: string, role?: string) => {
    if (isPrismaConfigured()) {
      try {
      const account = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, city: true, storeProfile: { select: { id: true, city: true } } } })
      if (account?.role === 'OFICINA') {
        const [profile, serviceRequests] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId }, select: { quoteRequests: { orderBy: { createdAt: 'desc' }, include: { vehicle: true, proposals: { orderBy: { createdAt: 'desc' }, include: { storeProfile: true } }, purchase: { include: { proposal: { include: { storeProfile: true } }, storeProfile: true, review: true } } } }, purchases: { orderBy: { createdAt: 'desc' }, include: { quoteRequest: true, proposal: { include: { storeProfile: true } }, storeProfile: true, review: true } }, reviews: { orderBy: { createdAt: 'desc' }, include: { storeProfile: true, purchase: true } }, notifications: { orderBy: { createdAt: 'desc' }, take: 20 } } }),
          prisma.quoteRequest.findMany({ where: { category: 'Oficina', status: { not: 'CLOSED' } }, orderBy: { createdAt: 'desc' }, include: { vehicle: true, proposals: { include: { storeProfile: true } }, user: { select: { name: true, city: true, neighborhood: true } } } })
        ])
        return { ...(profile || { quoteRequests: [], purchases: [], reviews: [], notifications: [] }), serviceRequests: serviceRequests.filter((quote) => quote.userId !== userId && (!account.storeProfile?.city || quote.targetCities.includes(account.storeProfile.city))) }
      }
      if (account && ['LOJISTA', 'VENDEDOR', 'GUINCHO'].includes(role || account.role) && account.storeProfile) {
        const [proposals, purchases, reviews, notifications, serviceRequests] = await Promise.all([
          prisma.proposal.findMany({ where: { storeProfileId: account.storeProfile.id }, orderBy: { createdAt: 'desc' }, include: { quoteRequest: { include: { vehicle: true, proposals: { select: { storeProfileId: true } }, user: { select: { name: true, city: true, neighborhood: true } } } }, storeProfile: true } }),
          prisma.purchase.findMany({ where: { storeProfileId: account.storeProfile.id }, orderBy: { createdAt: 'desc' }, include: { quoteRequest: true, proposal: { include: { storeProfile: true } }, storeProfile: true } }),
          prisma.review.findMany({ where: { storeProfileId: account.storeProfile.id }, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } }, purchase: true } }),
          prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
          account.role === 'GUINCHO' ? prisma.quoteRequest.findMany({ where: { category: 'Guincho', status: { not: 'CLOSED' } }, orderBy: { createdAt: 'desc' }, include: { vehicle: true, proposals: { include: { storeProfile: true } }, user: { select: { name: true, city: true, neighborhood: true } } } }) : Promise.resolve([]),
        ])
        return { quoteRequests: [], purchases: [], reviews: [], notifications, serviceRequests: account.role === 'GUINCHO' ? serviceRequests.filter((quote) => quote.userId !== userId && (!account.storeProfile?.city || quote.targetCities.includes(account.storeProfile.city))) : [], sellerProposals: proposals, sellerPurchases: purchases, sellerReviews: reviews }
      }
      return prisma.user.findUnique({ where: { id: userId }, select: {
        quoteRequests: { orderBy: { createdAt: 'desc' }, include: { vehicle: true, proposals: { orderBy: { createdAt: 'desc' }, include: { storeProfile: true } }, purchase: { include: { proposal: { include: { storeProfile: true } }, storeProfile: true, review: true } } } },
        purchases: { orderBy: { createdAt: 'desc' }, include: { quoteRequest: true, proposal: { include: { storeProfile: true } }, storeProfile: true, review: true } },
        reviews: { orderBy: { createdAt: 'desc' }, include: { storeProfile: true, purchase: true } },
        notifications: { orderBy: { createdAt: 'desc' }, take: 20 }
      } })
      } catch (e) {
        console.warn('Prisma dashboard query error, fallback to memory:', e)
      }
    }
    const quotes = quotesMemory.filter((quote) => quote.userId === userId)
    const purchases = purchasesMemory.filter((purchase) => purchase.userId === userId)
    const seller = usersMemory.find((item) => item.id === userId)?.storeProfile
    if (seller && ['LOJISTA', 'VENDEDOR', 'GUINCHO'].includes(role || usersMemory.find((item) => item.id === userId)?.role || '')) {
      const sellerProposals = proposalsMemory.filter((proposal) => proposal.storeProfileId === seller.id).map((proposal) => ({ ...proposal, quoteRequest: quotesMemory.find((quote) => quote.id === proposal.quoteRequestId) }))
      const currentRole = role || usersMemory.find((item) => item.id === userId)?.role
      const serviceRequests = currentRole === 'GUINCHO' ? quotesMemory.filter((quote) => quote.category === 'Guincho' && quote.status !== 'CLOSED' && quote.userId !== userId && (seller.city ? quote.targetCities.includes(seller.city) : true)) : []
      return { quoteRequests: [], purchases: [], reviews: [], notifications: notificationsMemory.filter((notification) => notification.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20), serviceRequests, sellerProposals, sellerPurchases: purchasesMemory.filter((purchase) => purchase.storeProfileId === seller.id), sellerReviews: reviewsMemory.filter((review) => review.storeProfileId === seller.id) }
    }
    const serviceRequests = quotesMemory.filter((quote) => quote.category === 'Oficina' && quote.status !== 'CLOSED' && quote.userId !== userId)
    return { quoteRequests: quotes, purchases, reviews: reviewsMemory.filter((review) => review.userId === userId), notifications: notificationsMemory.filter((notification) => notification.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20), serviceRequests }
  },

  updatePurchaseStatus: async (purchaseId: string, userId: string, status: string) => {
    const allowed = ['PENDING_CONTACT', 'CONFIRMED', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED']
    if (!allowed.includes(status)) throw new Error('INVALID_STATUS')
    if (isPrismaConfigured()) {
      const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId }, include: { storeProfile: true, quoteRequest: true } })
      if (!purchase || purchase.userId !== userId) throw new Error('NOT_ALLOWED')
      const updated = await prisma.purchase.update({ where: { id: purchaseId }, data: { status } })
      await prisma.notification.create({ data: { userId: purchase.storeProfile.userId, title: 'Status do pedido atualizado', message: `O pedido de ${purchase.quoteRequest.partName} foi marcado como ${status.toLowerCase().replace('_', ' ')}.`, link: '/cotacoes?view=realized' } })
      return updated
    }
    const purchase = purchasesMemory.find((item) => item.id === purchaseId && item.userId === userId)
    if (!purchase) throw new Error('NOT_ALLOWED')
    purchase.status = status; purchase.updatedAt = new Date()
    if (purchase.storeProfile) notificationsMemory.unshift({ id: `notification-${Date.now()}`, userId: purchase.storeProfile.userId, title: 'Status do pedido atualizado', message: `O pedido foi marcado como ${status.toLowerCase().replace('_', ' ')}.`, link: '/cotacoes?view=realized', read: false, createdAt: new Date() })
    return purchase
  },

  createReview: async (userId: string, data: { purchaseId: string; rating: number; comment?: string }) => {
    if (data.rating < 1 || data.rating > 5) throw new Error('INVALID_RATING')
    if (isPrismaConfigured()) {
      const purchase = await prisma.purchase.findUnique({ where: { id: data.purchaseId }, include: { proposal: true, storeProfile: true, quoteRequest: true, review: true } })
      if (!purchase || purchase.userId !== userId || purchase.status !== 'DELIVERED' || purchase.review) throw new Error('REVIEW_NOT_ALLOWED')
      const review = await prisma.review.create({ data: { userId, storeProfileId: purchase.storeProfileId, quoteRequestId: purchase.quoteRequestId, proposalId: purchase.proposalId, purchaseId: purchase.id, rating: data.rating, comment: data.comment || null }, include: { storeProfile: true } })
      await prisma.notification.create({ data: { userId: purchase.storeProfile.userId, title: 'Nova avaliação recebida', message: `Você recebeu uma avaliação de ${data.rating}/5 no pedido de ${purchase.quoteRequest.partName}.`, link: '/lojista/perfil' } })
      return review
    }
    const purchase = purchasesMemory.find((item) => item.id === data.purchaseId && item.userId === userId)
    if (!purchase || purchase.status !== 'DELIVERED' || reviewsMemory.some((review) => review.purchaseId === purchase.id)) throw new Error('REVIEW_NOT_ALLOWED')
    const review: ReviewData = { id: `review-${Date.now()}`, userId, storeProfileId: purchase.storeProfileId, quoteRequestId: purchase.quoteRequestId, proposalId: purchase.proposalId, purchaseId: purchase.id, rating: data.rating, comment: data.comment || null, createdAt: new Date(), storeProfile: purchase.storeProfile, purchase: null }
    reviewsMemory.unshift(review); purchase.review = review; return review
  },

  markNotificationsRead: async (userId: string) => {
    if (isPrismaConfigured()) return prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
    notificationsMemory.filter((notification) => notification.userId === userId).forEach((notification) => { notification.read = true }); return { count: 0 }
  },

}
