import { NextResponse } from 'next/server'
import { prisma } from '@/database/client'

// delete older than 30 days
// set as GET because of cron
export async function GET() {
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

  return NextResponse.json(204)
}
