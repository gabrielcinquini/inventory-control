'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
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
import { useGiveUserPermissions } from '@/hooks/Users'
import {
  editUserPermissionSchema,
  EditUserPermissionSchemaType,
} from '@/validations/validations'

type UserType = {
  id: string
  name: string
  lastName: string
}

export default function ChangePermissionsPage() {
  const form = useForm<EditUserPermissionSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(editUserPermissionSchema),
  })

  const getUsers = async () => {
    const response = await axios.get<UserType[]>('/api/users')
    return response.data
  }

  const { data: users, isLoading } = useQuery({
    queryFn: () => getUsers(),
    queryKey: ['users'],
  })

  const { onGiveUserPermissions } = useGiveUserPermissions()
  const handleChangeUserPermissions = async (
    value: EditUserPermissionSchemaType,
  ) => {
    try {
      await onGiveUserPermissions(value)
      form.reset({ userIdToUpdate: '' }) // Redefinir o formulário

      // Redefinir manualmente o valor do campo userIdToUpdate no Select
      form.setValue('userIdToUpdate', '')
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
        <p>Selecione um usuário para colocá-lo como admin</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangeUserPermissions)}>
            <FormField
              control={form.control}
              name="userIdToUpdate"
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
