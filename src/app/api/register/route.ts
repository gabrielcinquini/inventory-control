import { hashSync } from 'bcryptjs'
import CryptoJS from 'crypto-js'
import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { prismaClient } from '@/database/client'
import {
  LoginUserFormSchemaType,
  registerUserFormSchema,
} from '@/validations/validations'

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

  const parsedBody = registerUserFormSchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { username, password, name, lastName } = parsedBody.data

  const cryptUsername = CryptoJS.AES.encrypt(
    username,
    process.env.C_KEY,
  ).toString()

  const bytes = CryptoJS.AES.decrypt(cryptUsername, process.env.C_KEY)
  const originalUsername = bytes.toString(CryptoJS.enc.Utf8)

  const users = await prismaClient.user.findMany()

  const userRegistered = users.filter((user: LoginUserFormSchemaType) => {
    const bytes = CryptoJS.AES.decrypt(user.username, process.env.C_KEY)
    const originalUserUsername = bytes.toString(CryptoJS.enc.Utf8)
    return originalUsername === originalUserUsername
  })

  if (userRegistered.length > 0) {
    return NextResponse.json(
      { message: 'Usuário já cadastrado' },
      { status: 404 },
    )
  }

  const user = await prismaClient.user.create({
    data: {
      username: cryptUsername,
      password: hashSync(password, 10),
      name,
      lastName,
    },
    select: {
      name: true,
      lastName: true,
    },
  })

  return NextResponse.json({
    message: `Usuário ${user.name} ${user.lastName} cadastrado com sucesso!`,
  })
}
