'use client'

import { useEffect, useState } from 'react'
import PlanCheckoutModal from '@/components/checkout/PlanCheckoutModal'

type PlanCode = 'PRO' | 'PREMIUM'

export default function ConfirmarPlanoPage() {
  const [plan, setPlan] = useState<PlanCode>('PRO')

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('plan')
    if (value === 'PRO' || value === 'PREMIUM') setPlan(value)
  }, [])

  return <PlanCheckoutModal initialPlan={plan} />
}
