import { JsonWebTokenError, verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/database/client'

export async function GET(req: NextRequest) {
  const cookieValue = req.headers.get('Authorization')

  if (!cookieValue) {
    return NextResponse.json({ message: 'Invalid User' }, { status: 401 })
  }
  try {
    const { sub: userId } = verify(
      cookieValue,
      process.env.JWT_SECRET,
    ) as unknown as {
      sub: string
    }
    if (!userId) {
      return NextResponse.json({ message: 'Invalid User' }, { status: 401 })
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        lastName: true,
        admin: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      return NextResponse.json({ message: 'Invalid Token' }, { status: 401 })
    else return NextResponse.json({ Message: 'Unknown error' }, { status: 500 })
  }
}
