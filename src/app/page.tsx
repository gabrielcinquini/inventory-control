'use client'

import { ModeToggleTheme } from '@/components/ModeToggleTheme'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import SignInForm from '@/components/SignInForm'

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
