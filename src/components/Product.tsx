'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'
import { ItemSchemaType } from '@/validations/validations'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useDeleteProduct } from '@/hooks'
import { FormCreateProduct } from './FormCreateProduct'
import { FormEditProduct } from './FormEditProduct'
import { Pagination } from './Pagination'
import DeleteAlert from './DeleteAlert'

export default function Product({ itemsPerPage }: { itemsPerPage: number }) {
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const { onDeleteProduct } = useDeleteProduct()

  const { data: products } = useQuery({
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
            {products?.slice(startIndex, endIndex).map((item, index) => (
              <>
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.amount}/{item.totalAmount}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <FormEditProduct item={item} />

                      <DeleteAlert
                        title={`Tem certeza que deseja deletar o produto
                        ${item.name}?`}
                        fn={() => {
                          toast.promise(handleDeleteItem(item.id), {
                            loading: `Deletando o produto ${item.name}...`,
                          })
                        }}
                      />
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
