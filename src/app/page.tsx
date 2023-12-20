'use client'

import axios, { AxiosError } from 'axios'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'

import { useRouter } from 'next/navigation'
import { formatCPF } from '@/utils/utils'
import {
  LoginUserFormSchemaType,
  loginUserFormSchema,
} from '@/validations/validations'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/Loader'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ModeToggleTheme } from '@/components/ModeToggleTheme'

import { setCookie } from 'cookies-next'

export default function LoginPage() {
  const form = useForm<LoginUserFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(loginUserFormSchema),
  })

  const router = useRouter()

  const handleLogin = async (data: LoginUserFormSchemaType) => {
    try {
      const response = await axios.post('/api/login', {
        username: data.username,
        password: data.password,
      })

      if (response.status === 200) {
        router.push('/home')
        const token = response.data.accessToken

        setCookie('jwt', token)
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Não foi possível conectar ao banco de dados')
      }
    }
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="absolute top-12">
        <ModeToggleTheme />
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(handleLogin)}
        >
          <div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Usuário(C.P.F)"
                      {...field}
                      onChange={(event) => {
                        formatCPF(event)
                        field.onChange(event)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Senha"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full justify-between flex-col gap-8">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
