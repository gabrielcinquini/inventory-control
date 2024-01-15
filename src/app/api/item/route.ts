import { prisma } from '@/database/client'
import { itemSchemaForm } from '@/validations/validations'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const items = await prisma.item.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      amount: true,
      totalAmount: true,
    },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsedBody = itemSchemaForm.safeParse(body)

  if (!parsedBody.success) return NextResponse.json(parsedBody.error)

  const { name, amount, totalAmount } = parsedBody.data

  const itemAlreadyRegistered = await prisma.item.findFirst({
    where: {
      name,
    },
  })

  if (itemAlreadyRegistered)
    return NextResponse.json(
      {
        message: `Produto ${itemAlreadyRegistered.name} já existe!`,
      },
      { status: 404 },
    )

  const itemCreated = await prisma.item.create({
    data: {
      name,
      amount,
      totalAmount,
    },
  })

  return NextResponse.json({
    message: `Produto ${itemCreated.name} cadastrado com sucesso!`,
  })
}
