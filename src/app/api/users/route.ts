import { NextResponse } from 'next/server'

import { prisma } from '@/database/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    where: {
      admin: false,
    },
    select: {
      id: true,
      name: true,
      lastName: true,
    },
  })

  return NextResponse.json(users)
}
