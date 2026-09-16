import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const vehicles = await db.findVehiclesByUserId(user.id)

    return NextResponse.json({ vehicles })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar veículos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { type, brand, model, year, engine, plate } = body

    if (!brand || !model || !year) {
      return NextResponse.json({ error: 'Marca, modelo e ano são obrigatórios' }, { status: 400 })
    }

    const vehicle = await db.createVehicle({
      userId: user.id,
      type: type || 'CARRO',
      brand,
      model,
      year: String(year),
      engine: engine || '',
      plate: plate ? plate.toUpperCase() : null
    })

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar veículo' }, { status: 500 })
  }
}
