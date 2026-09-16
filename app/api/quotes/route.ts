import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get('scope')
    const category = searchParams.get('category')
    const user = await getCurrentUser()

    if (scope === 'my') {
      if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      const quotes = await db.findQuotes({ userId: user.id })
      return NextResponse.json({ quotes })
    }

    const quotes = await db.findQuotes({ scope: 'radar', category: category || 'Todas' })
    return NextResponse.json({ quotes })
  } catch (error) {
    console.error('Erro em GET /api/quotes:', error)
    return NextResponse.json({ error: 'Erro ao buscar cotações' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Faça login para publicar sua cotação' }, { status: 401 })
    }

    const body = await req.json()
    const { vehicleId, vehicleText, partName, description, category, deliveryPreference, targetCities, photos } = body

    if (!partName || !description) {
      return NextResponse.json({ error: 'Nome da peça e descrição são obrigatórios' }, { status: 400 })
    }

    const quote = await db.createQuote({
      userId: user.id,
      vehicleId: vehicleId || null,
      vehicleText: vehicleText || null,
      partName,
      description,
      category: category || 'Geral',
      deliveryPreference: deliveryPreference || 'DELIVERY',
      targetCities,
      photos
    })

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error('Erro em POST /api/quotes:', error)
    return NextResponse.json({ error: 'Erro ao criar cotação' }, { status: 500 })
  }
}
