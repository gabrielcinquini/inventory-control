'use client'

import { useEffect } from 'react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

export function VerifyCookie({ isLogged }: { isLogged: boolean }) {
  const router = useRouter()

  useEffect(() => {
    !isLogged && deleteCookie('jwt')
    router.push('/')
  }, [isLogged, router])

  return null
}
