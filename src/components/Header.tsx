'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/store'
import { ModeToggleTheme } from './ModeToggleTheme'

export default function Header() {
  const { user } = useStore()

  if (!user) return <p>Loading...</p>

  return (
    <header className="h-40 px-10 pt-2 flex justify-between">
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>
          {user?.name.charAt(0)}
          {user.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-4xl">Estoque</h1>
      <ModeToggleTheme />
    </header>
  )
}
