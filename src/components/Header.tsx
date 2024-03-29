'use client'

import { deleteCookie } from 'cookies-next'
import { LogOut, UserPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/store'

import { ModeToggleTheme } from './ModeToggleTheme'
import { Skeleton } from './ui/skeleton'

export default function Header() {
  const { user } = useStore()

  const handleLogout = () => {
    deleteCookie('jwt')
    window.location.href = '/'
  }

  return (
    <header className="flex h-40 justify-between px-10 pt-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {!user ? (
            <Skeleton className="h-10 w-10" />
          ) : (
            <button className="flex h-fit items-center justify-center">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {user.name.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <button className="flex w-full" onClick={handleLogout}>
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {user?.admin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <Link className="flex w-full" href="/register">
                    Criar Conta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <Link className="flex w-full" href="/change-permissions">
                    Alterar Admin
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <Link className="flex w-full" href="/delete-account">
                    Deletar Conta
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <h1 className="text-4xl">Estoque</h1>
      <ModeToggleTheme />
    </header>
  )
}
