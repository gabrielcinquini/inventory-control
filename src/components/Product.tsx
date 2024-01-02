'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteProduct } from '@/hooks'
import { useStore } from '@/store'
import { ItemSchemaType } from '@/validations/validations'

import DeleteAlert from './DeleteAlert'
import { FormCreateProduct } from './FormCreateProduct'
import { FormEditProduct } from './FormEditProduct'
import { Pagination } from './Pagination'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

export default function Product({ itemsPerPage }: { itemsPerPage: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const { pending } = useStore()

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const { onDeleteProduct } = useDeleteProduct()

  const { data: products, isLoading } = useQuery({
    queryFn: () => getProducts(),
    queryKey: ['products'],
  })

  const totalPages =
    products && products.length > 0
      ? Math.ceil(products.length / itemsPerPage)
      : 1

  const getProducts = async () => {
    const response = await axios.get<ItemSchemaType[]>('/api/item')
    return response.data
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await onDeleteProduct(id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
        <CardDescription>
          Os produtos do seu estoque estão aqui.
        </CardDescription>
        <FormCreateProduct />
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead align="right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-10" />
                  </TableCell>
                </TableRow>
              ))}
            {products?.slice(startIndex, endIndex).map((item, index) => (
              <>
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.amount}/{item.totalAmount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FormEditProduct item={item} />

                      <DeleteAlert
                        title={`Tem certeza que deseja deletar o produto
                        ${item.name}?`}
                        fn={() => {
                          toast.promise(handleDeleteItem(item.id), {
                            loading: `Deletando o produto ${item.name}...`,
                          })
                        }}
                      >
                        <button
                          className="rounded-full bg-red-600 p-2 text-black transition-all duration-200 hover:bg-red-950 disabled:opacity-80"
                          disabled={pending}
                        >
                          <Trash2 />
                        </button>
                      </DeleteAlert>
                    </div>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </CardFooter>
    </Card>
  )
}
