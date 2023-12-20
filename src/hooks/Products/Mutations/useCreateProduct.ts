import { ItemSchemaFormType } from '@/validations/validations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { revalidatePath } from '@/utils/utils'
import { toast } from 'sonner'

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
