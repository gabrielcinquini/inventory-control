import { NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'

export async function GET() {
  const users = await prismaClient.user.findMany({
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
