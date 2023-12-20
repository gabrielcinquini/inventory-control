import Header from '@/components/Header'
import React, { PropsWithChildren } from 'react'

export default function LayoutHome({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
