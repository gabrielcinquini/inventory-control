import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { getCookie } from 'cookies-next'
import { revalidatePath } from '@/utils/utils'
import { toast } from 'sonner'
import { useStore } from '@/store'

export const useDeleteProduct = () => {
  const { setPending } = useStore()
  const queryClient = useQueryClient()

  const { mutateAsync: onDeleteProduct, ...mutation } = useMutation({
    mutationFn: async (id: string) => {
      setPending(true)
      const authToken = getCookie('jwt')
      const response = await axios.delete(`/api/item/${id}`, {
        headers: { Authorization: authToken },
      })

      return response
    },
    onSuccess: (response: AxiosResponse) => {
      setPending(false)
      toast.success(response.data.message)
      revalidatePath(['products', 'controls'], queryClient)
    },
    onError: (err) => {
      setPending(false)
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Ocorreu um erro inesperado')
      }
    },
  })

  return { onDeleteProduct, ...mutation }
}
