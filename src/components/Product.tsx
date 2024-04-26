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
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function Product({ itemsPerPage }: { itemsPerPage: number }) {
  const { user } = useStore()
  const [currentPage, setCurrentPage] = useState(1)
  const { pending } = useStore()

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const { onDeleteProduct } = useDeleteProduct()

  const { data: products, isLoading } = useQuery({
    queryFn: () => getProducts(),
    queryKey: ['products'],
  })

  const [filter, setFilter] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<string>('all')
  const filteredProducts = products?.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(filter.toLowerCase())
    const roomMatch =
      selectedRoom !== 'all' ? product.room === selectedRoom : true
    return nameMatch && roomMatch
  })

  const totalPages =
    filteredProducts && filteredProducts.length > 0
      ? Math.ceil(filteredProducts.length / itemsPerPage)
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
        <div className="flex flex-col gap-10">
          <FormCreateProduct />
          <div className="flex gap-2">
            <Input
              className="w-1/2"
              placeholder="Filtrar por NOME"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            />
            <Select
              onValueChange={(value) => {
                setSelectedRoom(value)
              }}
            >
              <SelectTrigger className="w-[200px] p-3">
                <SelectValue placeholder="Todas as salas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as salas</SelectItem>
                  <SelectItem value="F04">F04</SelectItem>
                  <SelectItem value="F07">F07</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead align="right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-10" />
                  </TableCell>
                </TableRow>
              ))}
            {filteredProducts?.slice(startIndex, endIndex).map((item) => (
              <>
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.amount}/{item.totalAmount}
                  </TableCell>
                  <TableCell>{item.room}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FormEditProduct item={item} />

                      {user?.admin && (
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
                      )}
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
