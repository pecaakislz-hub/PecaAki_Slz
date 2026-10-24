import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getStoreSubscriptionOverview, PLAN_CATALOG } from '@/lib/subscriptions'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Faça login para acessar os planos.' }, { status: 401 })
  if (!['LOJISTA', 'VENDEDOR'].includes(user.role) || !user.storeProfile) {
    return NextResponse.json({ error: 'A área de planos está disponível para lojistas.' }, { status: 403 })
  }
  try {
    const overview = await getStoreSubscriptionOverview(user.storeProfile.id)
    return NextResponse.json({ overview, plans: PLAN_CATALOG })
  } catch (error) {
    console.error('Erro ao carregar assinatura:', error)
    return NextResponse.json({ error: 'Não foi possível carregar a assinatura agora.' }, { status: 500 })
  }
}
