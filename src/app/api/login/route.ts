import { NextRequest, NextResponse } from 'next/server'

import { sign } from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import CryptoJS from 'crypto-js'

import { prisma } from '@/database/client'
import {
  LoginUserFormSchemaType,
  loginUserFormSchema,
} from '@/validations/validations'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsedBody = loginUserFormSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { username, password } = parsedBody.data

  if (!username || !password) {
    return NextResponse.json(
      { message: 'Deve ser inserido o usuário e a senha' },
      { status: 404 },
    )
  }

  const cryptUsername = CryptoJS.AES.encrypt(
    username,
    process.env.C_KEY,
  ).toString()

  const bytes = CryptoJS.AES.decrypt(cryptUsername, process.env.C_KEY)
  const originalUsername = bytes.toString(CryptoJS.enc.Utf8)

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      password: true,
      name: true,
      lastName: true,
      admin: true,
    },
  })

  const user = users.find((user: LoginUserFormSchemaType) => {
    const bytes = CryptoJS.AES.decrypt(user.username, process.env.C_KEY)
    const originalUserUsername = bytes.toString(CryptoJS.enc.Utf8)
    return originalUsername === originalUserUsername
  })

  if (!user || !compareSync(password, user.password)) {
    return NextResponse.json(
      { message: 'Usuário ou senha incorretas' },
      { status: 404 },
    )
  }

  const accessToken = sign({ sub: user.id }, 'SUPER_SECRET', {
    expiresIn: '1d',
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  })

  return NextResponse.json({
    accessToken,
    user: { ...user, password: undefined },
  })
}
