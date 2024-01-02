import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { getCookie } from 'cookies-next'
import { toast } from 'sonner'

import { revalidatePath } from '@/utils/utils'
import { EditUserPermissionSchemaType } from '@/validations/validations'

export const useGiveUserPermissions = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: onGiveUserPermissions, ...mutation } = useMutation({
    mutationFn: async (data: EditUserPermissionSchemaType) => {
      const jwt = getCookie('jwt')

      const response = await axios.post(
        `/api/users/${data.userIdToUpdate}`,
        data,
        {
          headers: { Authorization: jwt },
        },
      )
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
  return { onGiveUserPermissions, ...mutation }
}
