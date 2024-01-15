import { NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'

interface ItemSummary {
  product: string
  amount: number
}

export async function GET() {
  const items = await prismaClient.item.findMany({
    select: {
      name: true,
      Control: {
        select: {
          newAmount: true,
          lastAmount: true,
        },
      },
    },
  })

  const itemSummary: ItemSummary[] = items.map((item) => {
    const totalNewAmount = item.Control.reduce((sum, control) => {
      if (control.newAmount < control.lastAmount) {
        return sum + control.lastAmount - control.newAmount
      }
      return sum
    }, 0)

    return {
      product: item.name,
      amount: totalNewAmount,
    }
  })

  const filteredControlsGraphic = itemSummary.filter(
    (control) => control.amount > 0,
  )

  const sortedControlsGraphic = filteredControlsGraphic.sort(
    (a, b) => b.amount - a.amount,
  )

  return NextResponse.json(sortedControlsGraphic.slice(0, 10))
}
