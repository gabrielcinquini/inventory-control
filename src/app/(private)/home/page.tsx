'use client'

import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store'
import Product from '@/components/Product'
import Control from '@/components/Control'

export default function HomePage() {
  const { user } = useStore()

  const itemsPerPage = 8

  return (
    <Tabs defaultValue="products" className="mx-10 max-sm:mx-2 mt-2">
      <TabsList
        className={`grid w-full ${user?.admin ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        <TabsTrigger value="products">Produtos</TabsTrigger>
        {user?.admin && <TabsTrigger value="control">Controle</TabsTrigger>}
      </TabsList>
      <TabsContent value="products">
        <Product itemsPerPage={itemsPerPage} />
      </TabsContent>
      <TabsContent value="control">
        <Control itemsPerPage={itemsPerPage} />
      </TabsContent>
    </Tabs>
  )
}
