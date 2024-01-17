import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/database/client'

export interface ParamsProps {
  params: {
    id: string
  }
}

export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  const { id } = params
  const authToken = req.headers.get('Authorization')
  if (!authToken)
    return NextResponse.json(
      { message: 'O token deve ser passado' },
      { status: 404 },
    )
  const { sub: userId } = verify(authToken, process.env.JWT_SECRET)
  const userFound = await prisma.user.findFirst({
    where: { id: userId as string },
    select: {
      admin: true,
    },
  })
  if (!userFound)
    return NextResponse.json(
      { message: 'Usuário não encontrado' },
      { status: 404 },
    )

  if (!userFound.admin)
    return NextResponse.json(
      { message: 'Você não tem permissão para deletar esse registro' },
      { status: 404 },
    )

  const controlDeleted = await prisma.control.delete({
    where: { id },
  })

  if (!controlDeleted) {
    return NextResponse.json(
      { message: 'Não foi possível deletar esse produto' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    {
      message: `Registro de controle deletado com sucesso!`,
    },
    { status: 200 },
  )
}
