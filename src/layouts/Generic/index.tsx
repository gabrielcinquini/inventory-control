'use client'

import { useTheme } from 'next-themes'
import React, { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'

type ThemeOptions = 'dark' | 'light' | 'system'

export function GenericLayout({ children }: PropsWithChildren) {
  const { theme } = useTheme()

  return (
    <>
      <Toaster
        richColors
        theme={theme as ThemeOptions}
        closeButton
        duration={3000}
        position="top-right"
      />
      {children}
    </>
  )
}
