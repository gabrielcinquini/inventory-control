import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useEditProduct } from '@/hooks'
import { useStore } from '@/store'
import {
  editItemSchemaForm,
  EditItemSchemaFormType,
  ItemSchemaType,
} from '@/validations/validations'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'

type FormEditProductType = {
  item: ItemSchemaType
}

export function FormEditProduct({ item }: FormEditProductType) {
  const { pending } = useStore()
  const [product, setProduct] = useState<ItemSchemaType>({
    id: '',
    name: '',
    amount: 0,
    totalAmount: 0,
    room: 'F04',
  })
  const { onEditProduct } = useEditProduct(product)

  const formEditProduct = useForm<EditItemSchemaFormType>({
    resolver: zodResolver(editItemSchemaForm),
    mode: 'onSubmit',
  })

  const handleEditItem = async (value: EditItemSchemaFormType) => {
    try {
      await onEditProduct(value)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="rounded-full bg-orange-400 p-2 text-black transition-all duration-200 hover:bg-orange-200 disabled:opacity-80"
          disabled={pending}
          onClick={() => setProduct(item)}
        >
          <Pencil />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar o Produto: {item.name}</DialogTitle>
          <DialogDescription>
            Quantidade Atual: {item.amount}/{item.totalAmount}
          </DialogDescription>
          <DialogDescription>
            Quantidade Atualizada: {product.amount}/{product.totalAmount}
          </DialogDescription>
        </DialogHeader>
        <Form {...formEditProduct}>
          <form
            onSubmit={formEditProduct.handleSubmit(handleEditItem)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={formEditProduct.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="amount" className="text-right">
                      Quantidade
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) => {
                          field.onChange(parseInt(event.target.value, 10))
                          setProduct({
                            ...product,
                            amount: parseInt(event.target.value, 10),
                          })
                        }}
                        defaultValue={product.amount}
                        className="col-span-3"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formEditProduct.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="totalAmount" className="text-right">
                      Estoque
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) => {
                          field.onChange(parseInt(event.target.value, 10))
                          setProduct({
                            ...product,
                            totalAmount: parseInt(event.target.value, 10),
                          })
                        }}
                        defaultValue={product.totalAmount}
                        className="col-span-3"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
