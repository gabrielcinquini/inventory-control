import { NextResponse } from 'next/server'

import { prisma } from '@/database/client'

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

// delete older than 30 days
export async function DELETE() {
  const trintaDiasAtras = new Date()
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)

  const registrosParaExcluir = await prisma.control.findMany({
    where: {
      modifiedAt: {
        lt: trintaDiasAtras,
      },
    },
  })

  for (const registro of registrosParaExcluir) {
    await prisma.control.delete({
      where: {
        id: registro.id,
      },
    })
  }

  return NextResponse.json({
    success: 'Registros com mais de 30 dias deletados com sucesso!',
  })
}
