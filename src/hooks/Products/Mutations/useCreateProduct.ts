import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

import { revalidatePath } from '@/utils/utils'
import { ItemSchemaFormType } from '@/validations/validations'

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: onCreateProduct, ...mutation } = useMutation({
    mutationFn: async (value: ItemSchemaFormType) => {
      const response = await axios.post('/api/item', value)
      return response
    },
    onSuccess: (response: AxiosResponse) => {
      toast.success(response.data.message)
      revalidatePath(['products'], queryClient)
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
  return { onCreateProduct, ...mutation }
}
