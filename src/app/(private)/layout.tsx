import UserStoreInitializer from '@/store/initializer'
import { UseMeType } from '@/validations/validations'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { PropsWithChildren } from 'react'
import { cookies, headers } from 'next/headers'

async function getUser() {
  try {
    const jwt = cookies().get('jwt')?.value

    if (!jwt) throw new Error('Token missing')
    const formattedHost = `
      ${headers().get('x-forwarded-proto')}://${headers().get('host')}`

    const response = await axios.get<UseMeType>(`${formattedHost}/api/me`, {
      headers: {
        Authorization: jwt,
      },
    })
    return response.data
  } catch (error) {
    redirect('/')
  }
}

export default async function layout({ children }: PropsWithChildren) {
  const response = await getUser()
  return (
    <div>
      <UserStoreInitializer user={response} />
      {children}
    </div>
  )
}
