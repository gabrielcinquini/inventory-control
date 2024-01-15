import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import { useCreateProduct } from '@/hooks'
import { itemSchemaForm, ItemSchemaFormType } from '@/validations/validations'

import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'

export function FormCreateProduct() {
  const formCreateProduct = useForm<ItemSchemaFormType>({
    resolver: zodResolver(itemSchemaForm),
    mode: 'onSubmit',
  })

  const { onCreateProduct } = useCreateProduct()

  const handleRegisterItem = async (value: ItemSchemaFormType) => {
    try {
      await onCreateProduct(value)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form {...formCreateProduct}>
      <form
        onSubmit={formCreateProduct.handleSubmit(handleRegisterItem)}
        className="flex gap-2"
      >
        <FormField
          control={formCreateProduct.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nome"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                  }}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formCreateProduct.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantidade em Estoque"
                  {...field}
                  onChange={(event) => {
                    field.onChange(parseInt(event.target.value, 10))
                  }}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Cadastrar Produto</Button>
      </form>
    </Form>
  )
}
