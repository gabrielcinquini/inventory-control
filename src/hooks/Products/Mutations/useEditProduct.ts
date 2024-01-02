import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { getCookie } from 'cookies-next'
import { toast } from 'sonner'

import { useStore } from '@/store'
import { revalidatePath } from '@/utils/utils'
import {
  EditItemSchemaFormType,
  ItemSchemaType,
} from '@/validations/validations'

export const useEditProduct = (product: ItemSchemaType) => {
  const queryClient = useQueryClient()
  const { setPending } = useStore()

  const { mutateAsync: onEditProduct, ...mutation } = useMutation({
    mutationFn: async (value: EditItemSchemaFormType) => {
      if (!value.id) value.id = product.id
      if (!value.amount) value.amount = product.amount
      if (!value.totalAmount) value.totalAmount = product.totalAmount
      const jwt = getCookie('jwt')
      const response = await axios.post(`/api/item/${value.id}`, value, {
        headers: { Authorization: jwt },
      })

      return response
    },
    onSuccess: (response) => {
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

  return { onEditProduct, ...mutation }
}
