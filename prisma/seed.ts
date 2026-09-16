import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando inclusão dos dados de teste no PeçaAki (Grande São Luís)...')

  // Limpar banco
  await prisma.notification.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.quoteRequest.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.storeProfile.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('123456', 10)

  // 1. Criar Lojistas e Perfis de Lojas na Grande São Luís
  const lojista1 = await prisma.user.create({
    data: {
      name: 'Roberto Alemanha',
      email: 'alemanha@pecaaki.com.br',
      passwordHash,
      phone: '98988776655',
      role: 'LOJISTA',
      city: 'São Luís',
      neighborhood: 'Alemanha',
      storeProfile: {
        create: {
          companyName: 'São Luís Auto Peças LTDA',
          fantasyName: 'São Luís Auto Peças',
          cnpjCpf: '12.345.678/0001-90',
          phone: '98988776655',
          city: 'São Luís',
          neighborhood: 'Alemanha',
          address: 'Av. dos Franceses, 1200 - Alemanha, São Luís - MA',
          categories: JSON.stringify(['Motor', 'Suspensão', 'Freios', 'Elétrica']),
          vehicleBrands: JSON.stringify(['Chevrolet', 'Volkswagen', 'Fiat', 'Hyundai', 'Ford', 'Toyota']),
          isVerified: true
        }
      }
    }
  })

  const lojista2 = await prisma.user.create({
    data: {
      name: 'Marcos Cohab',
      email: 'cohab@pecaaki.com.br',
      passwordHash,
      phone: '98991223344',
      role: 'LOJISTA',
      city: 'São Luís',
      neighborhood: 'Cohab',
      storeProfile: {
        create: {
          companyName: 'Motopeças do Ilha EIRELI',
          fantasyName: 'Motopeças do Ilha',
          cnpjCpf: '98.765.432/0001-10',
          phone: '98991223344',
          city: 'São Luís',
          neighborhood: 'Cohab',
          address: 'Av. Jerônimo de Albuquerque, 450 - Cohab, São Luís - MA',
          categories: JSON.stringify(['Transmissão', 'Motor Moto', 'Capacetes', 'Pneus', 'Freios']),
          vehicleBrands: JSON.stringify(['Honda', 'Yamaha', 'Shineray', 'BMW']),
          isVerified: true
        }
      }
    }
  })

  const lojista3 = await prisma.user.create({
    data: {
      name: 'Raimundo Maiobão',
      email: 'maiobao@pecaaki.com.br',
      passwordHash,
      phone: '98981112233',
      role: 'LOJISTA',
      city: 'Paço do Lumiar',
      neighborhood: 'Maiobão',
      storeProfile: {
        create: {
          companyName: 'Desmanche Credenciado Maiobão LTDA',
          fantasyName: 'Desmanche Credenciado Maiobão',
          cnpjCpf: '45.678.910/0001-33',
          phone: '98981112233',
          city: 'Paço do Lumiar',
          neighborhood: 'Maiobão',
          address: 'Av. 13 de Maio, Quadra 10 - Maiobão, Paço do Lumiar - MA',
          categories: JSON.stringify(['Peças Usadas', 'Lataria', 'Vidros', 'Faróis', 'Rodas']),
          vehicleBrands: JSON.stringify(['Chevrolet', 'Fiat', 'Volkswagen', 'Honda', 'Hyundai', 'Renault']),
          isVerified: true
        }
      }
    }
  })

  console.log('✅ 3 Lojas da Grande São Luís criadas com sucesso!')

  // 2. Criar Compradores
  const comprador1 = await prisma.user.create({
    data: {
      name: 'Carlos Eduardo (Motorista App)',
      email: 'carlos.app@gmail.com',
      passwordHash,
      phone: '98998887766',
      role: 'COMPRADOR',
      city: 'São Luís',
      neighborhood: 'Cohafuma'
    }
  })

  const comprador2 = await prisma.user.create({
    data: {
      name: 'Sérgio Mecânico',
      email: 'sergio.mecanico@gmail.com',
      passwordHash,
      phone: '98987776655',
      role: 'COMPRADOR',
      city: 'São Luís',
      neighborhood: 'Renascença'
    }
  })

  console.log('✅ Compradores cadastrados!')

  // 3. Criar Veículos na Garagem Virtual
  const veiculo1 = await prisma.vehicle.create({
    data: {
      userId: comprador1.id,
      type: 'CARRO',
      brand: 'Chevrolet',
      model: 'Onix Hatch LT 1.0 Flex',
      year: '2020',
      engine: '1.0 12V Flex',
      plate: 'PSL-4090'
    }
  })

  const veiculo2 = await prisma.vehicle.create({
    data: {
      userId: comprador2.id,
      type: 'MOTO',
      brand: 'Honda',
      model: 'CG 160 Fan ESDI',
      year: '2022',
      engine: '160cc',
      plate: 'ROX-1E99'
    }
  })

  console.log('✅ Garagem Virtual populada!')

  // 4. Criar Solicitações de Cotações
  const cotacao1 = await prisma.quoteRequest.create({
    data: {
      userId: comprador1.id,
      vehicleId: veiculo1.id,
      partName: 'Par de Amortecedores Dianteiros',
      description: 'Preciso do par de amortecedores dianteiros para Onix 2020. Preferência por Cofap ou Kayaba com coxins.',
      category: 'Suspensão',
      deliveryPreference: 'DELIVERY',
      targetCities: JSON.stringify(['São Luís', 'Paço do Lumiar', 'São José de Ribamar']),
      photos: JSON.stringify(['/uploads/amortecedor_onix.jpg']),
      status: 'ANSWERED'
    }
  })

  const cotacao2 = await prisma.quoteRequest.create({
    data: {
      userId: comprador2.id,
      vehicleId: veiculo2.id,
      partName: 'Kit Relação (Corrente, Coroa e Pinhão) com Retentor',
      description: 'Kit de transmissão completo reforçado para CG 160 Fan 2022. Marca KMC ou DID.',
      category: 'Transmissão',
      deliveryPreference: 'PICKUP',
      targetCities: JSON.stringify(['São Luís', 'Paço do Lumiar']),
      photos: JSON.stringify(['/uploads/kit_relacao.jpg']),
      status: 'OPEN'
    }
  })

  console.log('✅ Cotações ativas criadas!')

  // 5. Criar Proposta do Lojista 1 na Cotação 1
  const store1 = await prisma.storeProfile.findUnique({ where: { userId: lojista1.id } })
  if (store1) {
    await prisma.proposal.create({
      data: {
        quoteRequestId: cotacao1.id,
        storeProfileId: store1.id,
        availability: 'IN_STOCK',
        condition: 'NEW',
        cashPrice: 420.00,
        installmentPrice: 460.00,
        deliveryFee: 15.00,
        deliveryTime: 'Até 2 horas (Motoboy próprio)',
        notes: 'Amortecedores Cofap TurboGás originais com 2 anos de garantia. Acompanha kit coxim e batente.',
        status: 'PENDING'
      }
    })
  }

  console.log('✅ Proposta de orçamento enviada pela São Luís Auto Peças!')
  console.log('🎉 Dados de teste inseridos com sucesso no banco PeçaAki!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
