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
  isVerified: boolean
  createdAt: Date
}

export interface UserData {
  id: string
  name: string
  email: string
  passwordHash: string
  phone: string
  role: string // 'COMPRADOR', 'LOJISTA', 'ADMIN'
  city: string
  neighborhood: string
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
        return await prisma.user.update({
          where: { id },
          data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.phone !== undefined ? { phone: data.phone } : {}),
            ...(data.city !== undefined ? { city: data.city } : {}),
            ...(data.neighborhood !== undefined ? { neighborhood: data.neighborhood } : {}),
          },
          include: { storeProfile: true },
        })
      } catch (e) {
        console.warn('Prisma update user error, fallback to memory:', e)
      }
    }
    const user = usersMemory.find((item) => item.id === id)
    if (!user) return null
    Object.assign(user, data)
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
            phone: data.phone,
            role: data.role || 'COMPRADOR',
            city: data.city || 'São Luís',
            neighborhood: data.neighborhood || 'Centro',
            ...((data.role === 'LOJISTA' || data.role === 'VENDEDOR') && data.storeProfile ? {
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
                  isVerified: true
                }
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
      phone: data.phone,
      role: data.role || 'COMPRADOR',
      city: data.city || 'São Luís',
      neighborhood: data.neighborhood || 'Centro',
      createdAt: new Date()
    }

    if ((data.role === 'LOJISTA' || data.role === 'VENDEDOR') && data.storeProfile) {
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
        isVerified: true,
        createdAt: new Date()
      }
      newUser.storeProfile = newStore
      storesMemory.push(newStore)
    }

    usersMemory.push(newUser)
    return newUser
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

        return await prisma.quoteRequest.findMany({
          where: whereClause,
          include: {
            vehicle: true,
            user: { select: { name: true, city: true, neighborhood: true } },
            proposals: { include: { storeProfile: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
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
    return result
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
        return await prisma.quoteRequest.create({
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
    return newQuote
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
      return prisma.$transaction(async (tx) => {
        const proposal = await tx.proposal.findUnique({ where: { id: proposalId }, include: { quoteRequest: true, storeProfile: true } })
        if (!proposal || proposal.quoteRequest.userId !== buyerId) throw new Error('NOT_ALLOWED')
        const existing = await tx.purchase.findUnique({ where: { quoteRequestId: proposal.quoteRequestId } })
        if (existing) return { proposal, purchase: existing }
        await tx.proposal.updateMany({ where: { quoteRequestId: proposal.quoteRequestId }, data: { status: 'REJECTED' } })
        const updatedProp = await tx.proposal.update({ where: { id: proposalId }, data: { status: 'ACCEPTED' } })
        await tx.quoteRequest.update({ where: { id: proposal.quoteRequestId }, data: { status: 'ACCEPTED', updatedAt: new Date() } })
        const purchase = await tx.purchase.create({ data: { userId: buyerId, quoteRequestId: proposal.quoteRequestId, proposalId, storeProfileId: proposal.storeProfileId, totalPrice: proposal.cashPrice + proposal.deliveryFee } })
        await tx.notification.create({ data: { userId: buyerId, title: 'Pedido criado', message: `Seu pedido de ${proposal.quoteRequest.partName} foi criado. Combine os próximos passos com a loja.`, link: `/cotacoes?view=purchases` } })
        await tx.notification.create({ data: { userId: proposal.storeProfile.userId, title: 'Proposta aceita', message: `Sua proposta para ${proposal.quoteRequest.partName} foi aceita pelo comprador.`, link: `/lojista/radar` } })
        return { proposal: updatedProp, purchase }
      })
    }
    const proposal = proposalsMemory.find((p) => p.id === proposalId)
    const quote = proposal && quotesMemory.find((q) => q.id === proposal.quoteRequestId)
    if (!proposal || !quote || quote.userId !== buyerId) throw new Error('NOT_ALLOWED')
    const existing = purchasesMemory.find((purchase) => purchase.quoteRequestId === quote.id)
    if (existing) return { proposal, purchase: existing }
    proposalsMemory.filter((item) => item.quoteRequestId === quote.id).forEach((item) => { item.status = item.id === proposalId ? 'ACCEPTED' : 'REJECTED' })
    proposal.status = 'ACCEPTED'; quote.status = 'ACCEPTED'; quote.updatedAt = new Date()
    const purchase: PurchaseData = { id: `purchase-${Date.now()}`, userId: buyerId, quoteRequestId: quote.id, proposalId, storeProfileId: proposal.storeProfileId, status: 'PENDING_CONTACT', totalPrice: proposal.cashPrice + proposal.deliveryFee, createdAt: new Date(), updatedAt: new Date(), quoteRequest: quote, proposal, storeProfile: proposal.storeProfile }
    purchasesMemory.unshift(purchase)
    notificationsMemory.unshift({ id: `notification-${Date.now()}`, userId: buyerId, title: 'Pedido criado', message: `Seu pedido de ${quote.partName} foi criado. Combine os próximos passos com a loja.`, link: '/cotacoes?view=purchases', read: false, createdAt: new Date() })
    if (proposal.storeProfile) notificationsMemory.unshift({ id: `notification-${Date.now() + 1}`, userId: proposal.storeProfile.userId, title: 'Proposta aceita', message: `Sua proposta para ${quote.partName} foi aceita pelo comprador.`, link: '/lojista/radar', read: false, createdAt: new Date() })
    return { proposal, purchase }
  },

  getUserDashboard: async (userId: string) => {
    if (isPrismaConfigured()) {
      return prisma.user.findUnique({ where: { id: userId }, select: {
        quoteRequests: { orderBy: { createdAt: 'desc' }, include: { vehicle: true, proposals: { orderBy: { createdAt: 'desc' }, include: { storeProfile: true } }, purchase: { include: { proposal: { include: { storeProfile: true } }, storeProfile: true, review: true } } } },
        purchases: { orderBy: { createdAt: 'desc' }, include: { quoteRequest: true, proposal: { include: { storeProfile: true } }, storeProfile: true, review: true } },
        reviews: { orderBy: { createdAt: 'desc' }, include: { storeProfile: true, purchase: true } },
        notifications: { orderBy: { createdAt: 'desc' }, take: 20 }
      } })
    }
    const quotes = quotesMemory.filter((quote) => quote.userId === userId)
    const purchases = purchasesMemory.filter((purchase) => purchase.userId === userId)
    return { quoteRequests: quotes, purchases, reviews: reviewsMemory.filter((review) => review.userId === userId), notifications: notificationsMemory.filter((notification) => notification.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20) }
  },

  updatePurchaseStatus: async (purchaseId: string, userId: string, status: string) => {
    const allowed = ['PENDING_CONTACT', 'CONFIRMED', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED']
    if (!allowed.includes(status)) throw new Error('INVALID_STATUS')
    if (isPrismaConfigured()) {
      const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId }, include: { storeProfile: true, quoteRequest: true } })
      if (!purchase || purchase.userId !== userId) throw new Error('NOT_ALLOWED')
      const updated = await prisma.purchase.update({ where: { id: purchaseId }, data: { status } })
      await prisma.notification.create({ data: { userId: purchase.storeProfile.userId, title: 'Status do pedido atualizado', message: `O pedido de ${purchase.quoteRequest.partName} foi marcado como ${status.toLowerCase().replace('_', ' ')}.`, link: '/lojista/radar' } })
      return updated
    }
    const purchase = purchasesMemory.find((item) => item.id === purchaseId && item.userId === userId)
    if (!purchase) throw new Error('NOT_ALLOWED')
    purchase.status = status; purchase.updatedAt = new Date()
    if (purchase.storeProfile) notificationsMemory.unshift({ id: `notification-${Date.now()}`, userId: purchase.storeProfile.userId, title: 'Status do pedido atualizado', message: `O pedido foi marcado como ${status.toLowerCase().replace('_', ' ')}.`, link: '/lojista/radar', read: false, createdAt: new Date() })
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
  }
}
