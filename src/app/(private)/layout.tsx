import axios from 'axios'
import { cookies, headers } from 'next/headers'
import React, { PropsWithChildren, Suspense } from 'react'

import UserStoreInitializer from '@/store/initializer'
import { UseMeType } from '@/validations/validations'
import { VerifyCookie } from '@/components/VerifyCookie'

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
    return null
  }
}

export default async function layout({ children }: PropsWithChildren) {
  const response = await getUser()
  return (
    <div>
      <UserStoreInitializer user={response} />
      <Suspense fallback={null}>
        <VerifyCookie isLogged={!!response} />
      </Suspense>
      {children}
    </div>
  )
}
