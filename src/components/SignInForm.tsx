'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatToNumber } from '@/utils/utils'
import {
  loginUserFormSchema,
  LoginUserFormSchemaType,
} from '@/validations/validations'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)

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
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2"
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
                    placeholder="Usuário(R.A)"
                    {...field}
                    onChange={(event) => {
                      formatToNumber(event)
                      field.onChange(event)
                    }}
                    autoComplete="off"
                    min={1}
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
              <FormItem className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                    }}
                    autoComplete="off"
                    min={1}
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
        </div>
        <Button
          className="mt-8 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Loader />}
          Enviar
        </Button>
      </form>
    </Form>
  )
}
