'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

import { ModeToggleTheme } from '@/components/ModeToggleTheme'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteUser } from '@/hooks'
import {
  deleteUserSchema,
  DeleteUserSchemaType,
} from '@/validations/validations'

type UserType = {
  id: string
  name: string
  lastName: string
}

export default function DeleteAccountPage() {
  const form = useForm<DeleteUserSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(deleteUserSchema),
  })

  const { data: users, isLoading } = useQuery({
    queryFn: () => getUsers(),
    queryKey: ['users'],
  })
  const getUsers = async () => {
    const response = await axios.get<UserType[]>('/api/users')
    return response.data
  }

  const { onDeleteUser } = useDeleteUser()
  const handleDeleteUser = async (value: DeleteUserSchemaType) => {
    try {
      await onDeleteUser(value)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute top-12">
        <ModeToggleTheme />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p>Selecione um usuário a ser deletado</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDeleteUser)}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="w-64">
                  <FormControl>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e)
                      }}
                    >
                      {isLoading ? (
                        <div>
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : (
                        <SelectTrigger className="p-2">
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                      )}
                      <SelectContent>
                        <SelectGroup>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} {user.lastName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <>
                      <Button className="w-full" type="submit">
                        Confirmar
                      </Button>
                      <Button asChild variant={'secondary'}>
                        <Link href="/home" className="flex w-full gap-2">
                          <ArrowLeftIcon />
                          Voltar
                        </Link>
                      </Button>
                    </>
                  )}
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
