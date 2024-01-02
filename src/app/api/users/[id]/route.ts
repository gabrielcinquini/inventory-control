import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import { editUserPermissionSchema } from '@/validations/validations'

export async function POST(req: NextRequest) {
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
      { message: 'Você não tem permissão para isso!' },
      { status: 404 },
    )

  const body = await req.json()
  const parsedBody = editUserPermissionSchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { userIdToUpdate } = parsedBody.data

  const userToUpdate = await prismaClient.user.findFirst({
    where: { id: userIdToUpdate },
    select: { id: true, name: true, lastName: true, admin: true },
  })

  if (!userToUpdate) {
    return NextResponse.json(
      {
        message: 'Usuário a ser atualizado não foi encontrado',
      },
      { status: 404 },
    )
  }

  if (userToUpdate.admin)
    return NextResponse.json(
      {
        message: `O usuário ${userToUpdate.name} ${userToUpdate.lastName} já é um administrador`,
      },
      { status: 404 },
    )

  const updatedUser = await prismaClient.user.update({
    where: { id: userToUpdate.id },
    data: {
      admin: true,
    },
    select: {
      name: true,
      lastName: true,
    },
  })

  if (!updatedUser) {
    return NextResponse.json(
      {
        message: 'Não foi possível atualizar esse usuário',
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    message: `Foi concedido permissão de admin para ${updatedUser.name} ${updatedUser.lastName} com sucesso!`,
  })
}

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
      { message: 'Você não tem permissão para isso!' },
      { status: 404 },
    )

  const userToDelete = await prismaClient.user.findFirst({
    where: { id },
    select: { id: true, name: true, lastName: true },
  })

  if (!userToDelete)
    return NextResponse.json(
      { message: 'Usuário não encontrado' },
      { status: 404 },
    )

  const userDeleted = await prismaClient.user.delete({
    where: { id: userToDelete.id },
    select: {
      name: true,
      lastName: true,
    },
  })

  if (!userDeleted) {
    return NextResponse.json(
      { message: 'Não foi possível deletar esse usuário' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    {
      message: `Usuário ${userDeleted.name} ${userDeleted.lastName} deletado com sucesso!`,
    },
    { status: 200 },
  )
}
