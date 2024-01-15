'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import axios, { AxiosError } from 'axios'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import { ModeToggleTheme } from '@/components/ModeToggleTheme'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatName, formatToNumber } from '@/utils/utils'
import {
  registerUserFormSchema,
  RegisterUserFormSchemaType,
} from '@/validations/validations'
import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterUserFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(registerUserFormSchema),
  })

  const handleRegister = async (
    user: Omit<RegisterUserFormSchemaType, 'confirmPassword'>,
  ) => {
    try {
      const jwt = getCookie('jwt')
      const response = await axios.post('/api/register', user, {
        headers: { Authorization: jwt },
      })

      toast.success(response.data.message)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Não foi possível conectar com o banco de dados')
      }
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute top-12">
        <ModeToggleTheme />
      </div>
      <Form {...form}>
        <form
          className="flex flex-col items-center gap-2"
          onSubmit={form.handleSubmit(handleRegister)}
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Usuário(R.A)"
                    onChange={(e) => {
                      formatToNumber(e)
                      field.onChange(e)
                    }}
                    autoComplete="off"
                    className="appearance-none"
                    min={4}
                    max={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nome"
                    onChange={(e) => {
                      field.onChange(e)
                      formatName(e)
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sobrenome"
                    onChange={(e) => {
                      field.onChange(e)
                      formatName(e)
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    onChange={field.onChange}
                    autoComplete="off"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 -translate-y-10"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirmar Senha"
                    onChange={field.onChange}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col justify-evenly gap-8">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              Cadastrar
            </Button>
            <Button asChild variant={'secondary'}>
              <Link href="/" className="flex w-full gap-2">
                <ArrowLeftIcon />
                Voltar
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
