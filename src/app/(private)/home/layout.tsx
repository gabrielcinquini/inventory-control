import React, { PropsWithChildren } from 'react'

import Header from '@/components/Header'

export default function LayoutHome({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
