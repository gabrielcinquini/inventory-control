import { format } from 'date-fns'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
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
import { Pagination } from './Pagination'
import { ControlSchemaType } from '@/validations/validations'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store'
import { useDeleteControl } from '@/hooks/Controls/Mutations/useDeleteControl'
import DeleteAlert from './DeleteAlert'

export default function Control({ itemsPerPage }: { itemsPerPage: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const { setPending } = useStore()

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle</CardTitle>
        <CardDescription>
          Aqui você pode observar quem fez determinada alteração.
        </CardDescription>
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
            {controls?.slice(startIndex, endIndex).map((control, index) => (
              <TableRow key={control.id}>
                <TableCell>
                  {control.User.name} {control.User.lastName}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(control.modifiedAt),
                    "dd/MM/yyyy 'às' HH:mm",
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
                  />
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
