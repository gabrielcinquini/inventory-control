import { Trash2 } from 'lucide-react'
import React from 'react'
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog'
import { useStore } from '@/store'

type DeleteAlertType = {
  title: string
  fn: () => void
}

export default function DeleteAlert({ title, fn }: DeleteAlertType) {
  const { pending } = useStore()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="bg-red-600 p-2 rounded-full text-black hover:bg-red-950 transition-all duration-200 disabled:opacity-80"
          disabled={pending}
        >
          <Trash2 />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente esse
            registro de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={fn}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
