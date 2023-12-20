import { NextRequest, NextResponse } from 'next/server'

import { hashSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import CryptoJS from 'crypto-js'

import { prismaClient } from '@/database/client'
import {
  LoginUserFormSchemaType,
  registerUserFormSchema,
} from '@/validations/validations'

export async function POST(req: NextRequest) {
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
  })

  const accessToken = sign({ sub: user.id }, 'SUPER_SECRET', {
    expiresIn: '1d',
  })

  return NextResponse.json({ accessToken })
}
