import { NextResponse } from 'next/server'

import { prisma } from '@/database/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const controls = await prisma.control.findMany({
    orderBy: {
      modifiedAt: 'desc',
    },
    select: {
      id: true,
      lastAmount: true,
      newAmount: true,
      lastAmountStock: true,
      newAmountStock: true,
      modifiedAt: true,
      User: {
        select: {
          name: true,
          lastName: true,
        },
      },
      Item: {
        select: {
          name: true,
        },
      },
    },
  })

  return NextResponse.json(controls)
}
