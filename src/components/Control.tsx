import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteControl } from '@/hooks/Controls/Mutations/useDeleteControl'
import { useStore } from '@/store'

import DeleteAlert from './DeleteAlert'
import { Pagination } from './Pagination'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

import { ControlSchemaType } from '@/validations/validations'
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

export default function Control({ itemsPerPage }: { itemsPerPage: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const { pending, setPending } = useStore()

  const { onDeleteControl } = useDeleteControl()

  const { data: controls, isLoading } = useQuery({
    queryFn: () => getControls(),
    queryKey: ['controls'],
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const totalPages =
    controls && controls.length > 0
      ? Math.ceil(controls.length / itemsPerPage)
      : 1

  const getControls = async () => {
    const response = await axios.get<ControlSchemaType[]>('/api/control')

    return response.data
  }

  const handleDeleteControl = async (id: string) => {
    try {
      await onDeleteControl(id)

      setPending(false)
    } catch (err) {
      console.error(err)
    }
  }

  const [filter, setFilter] = useState('')
  const filteredControls = controls?.filter((control) => {
    const userFullName =
      `${control.User.name} ${control.User.lastName}`.toLowerCase()
    const formattedDate = format(new Date(control.modifiedAt), 'PPPP', {
      locale: ptBR,
    })
    const productName = control.Item.name.toLowerCase()

    return (
      userFullName.includes(filter.toLowerCase()) ||
      productName.includes(filter.toLocaleLowerCase()) ||
      formattedDate.includes(filter.toLocaleLowerCase())
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle</CardTitle>
        <div className="flex flex-col gap-10">
          <CardDescription>
            Aqui você pode observar quem fez determinada alteração.
          </CardDescription>
          <Input
            className="w-1/2"
            placeholder="Filtrar por NOME ou DATA ou PRODUTO"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead align="right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10" />
                  </TableCell>
                </TableRow>
              ))}
            {filteredControls?.slice(startIndex, endIndex).map((control) => (
              <TableRow key={control.id}>
                <TableCell>
                  {control.User.name} {control.User.lastName}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(control.modifiedAt),
                    "iii, dd 'de' LLL 'de' yyyy 'às' HH:mm",
                    { locale: ptBR },
                  )}
                </TableCell>
                <TableCell>{control.Item.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {control.lastAmount} <ArrowRight width="14px" />{' '}
                    {control.newAmount}
                    {control.lastAmount > control.newAmount ? (
                      <ChevronDown className="text-red-600" />
                    ) : control.lastAmount < control.newAmount ? (
                      <ChevronUp className="text-green-600" />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {control.lastAmountStock} <ArrowRight width="14px" />{' '}
                    {control.newAmountStock}
                    {control.lastAmountStock > control.newAmountStock ? (
                      <ChevronDown className="text-red-600" />
                    ) : control.lastAmountStock < control.newAmountStock ? (
                      <ChevronUp className="text-green-600" />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <DeleteAlert
                    title={`Tem certeza que deseja deletar essa alteração feita em 
                      ${control.Item.name} por
                      ${control.User.name} ${control.User.lastName}?`}
                    fn={() => {
                      toast.promise(handleDeleteControl(control.id), {
                        loading: `Deletando o registro de controle de ${control.User.name} ${control.User.lastName}...`,
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
                </TableCell>
              </TableRow>
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
