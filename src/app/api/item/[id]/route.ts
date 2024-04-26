import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/database/client'
import { editItemSchemaForm } from '@/validations/validations'
import { ParamsProps } from '../../control/[id]/route'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsedBody = editItemSchemaForm.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { id, amount, totalAmount } = parsedBody.data

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
      id: true,
    },
  })
  if (!userFound)
    return NextResponse.json(
      { message: 'Usuário não encontrado' },
      { status: 404 },
    )

  if (typeof amount === 'undefined' || typeof totalAmount === 'undefined') {
    return NextResponse.json(
      {
        message:
          'Deve ser passado os valores da quantidade e da quantidade em estoque',
      },
      { status: 404 },
    )
  }

  if (amount > totalAmount)
    return NextResponse.json(
      {
        message: 'A quantidade deve ser menor ou igual à quantidade em estoque',
      },
      { status: 404 },
    )

  const lastItemFound = await prisma.item.findFirst({ where: { id } })
  if (!lastItemFound)
    return NextResponse.json(
      { message: 'Produto com esse id não encontrado' },
      { status: 404 },
    )
  if (
    lastItemFound.amount === amount &&
    lastItemFound.totalAmount === totalAmount
  )
    return NextResponse.json(
      { message: 'Deve ser alterado algum valor' },
      { status: 404 },
    )

  await prisma.control.create({
    data: {
      newAmount: amount,
      lastAmount: lastItemFound.amount,
      newAmountStock: totalAmount,
      lastAmountStock: lastItemFound.totalAmount,
      itemId: lastItemFound.id,
      userId: userFound.id,
    },
  })

  await prisma.item.update({
    where: {
      id,
    },
    data: {
      amount,
      totalAmount,
    },
  })

  return NextResponse.json({
    message: `Produto ${lastItemFound.name} atualizado com sucesso!`,
  })
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
      { message: 'Você não tem permissão para deletar esse produto' },
      { status: 404 },
    )

  const productDeleted = await prisma.item.delete({
    where: { id },
  })

  if (!productDeleted) {
    return NextResponse.json(
      { message: 'Não foi possível deletar esse produto' },
      { status: 400 },
    )
  }

  return NextResponse.json(
    { message: `Produto ${productDeleted.name} deletado com sucesso!` },
    { status: 200 },
  )
}
