import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { getCookie } from 'cookies-next'
import { toast } from 'sonner'

import { useStore } from '@/store'
import { revalidatePath } from '@/utils/utils'

export const useDeleteControl = () => {
  const { setPending } = useStore()
  const queryClient = useQueryClient()

  const { mutateAsync: onDeleteControl, ...mutation } = useMutation({
    mutationFn: async (id: string) => {
      try {
        setPending(true)
        const authToken = getCookie('jwt')
        await axios.delete(`/api/control/${id}`, {
          headers: { Authorization: authToken },
        })

        setPending(false)
      } catch (err) {
        setPending(false)
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message)
        } else {
          toast.error('Ocorreu um erro inesperado')
        }
      }
    },
    onSuccess: () => {
      revalidatePath(['controls'], queryClient)
    },
  })

  return { onDeleteControl, ...mutation }
}
