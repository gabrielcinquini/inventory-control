import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { getCookie } from 'cookies-next'
import { toast } from 'sonner'

import { revalidatePath } from '@/utils/utils'
import { DeleteUserSchemaType } from '@/validations/validations'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: onDeleteUser, ...mutation } = useMutation({
    mutationFn: async (data: DeleteUserSchemaType) => {
      const jwt = getCookie('jwt')

      const response = await axios.delete(`/api/users/${data.id}`, {
        headers: { Authorization: jwt },
      })
      return response
    },
    onSuccess: (response: AxiosResponse) => {
      toast.success(response.data.message)
      revalidatePath(['users'], queryClient)
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
        console.error(err)
      } else {
        toast.error('Ocorreu um erro inesperado')
      }
    },
  })
  return { onDeleteUser, ...mutation }
}
