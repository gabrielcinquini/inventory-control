import { prismaClient } from '@/database/client'
import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params
  const authToken = req.headers.get('Authorization')
  if (!authToken)
    return NextResponse.json(
      { message: 'O token deve ser passado' },
      { status: 404 },
    )
  const { sub: userId } = verify(authToken, 'SUPER_SECRET')
  const userFound = await prismaClient.user.findFirst({
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

  const controlDeleted = await prismaClient.control.delete({
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
