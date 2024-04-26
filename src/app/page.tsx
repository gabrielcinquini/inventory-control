'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import SignInForm from '@/components/SignInForm'

import { ModeToggleTheme } from '@/components/ModeToggleTheme'

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute top-12">
        <ModeToggleTheme />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>
            Insira o usuário e a senha abaixo para entrar
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-2">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}
