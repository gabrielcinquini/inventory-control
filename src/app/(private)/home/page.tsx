'use client'

import React from 'react'

import Control from '@/components/Control'
import PopularProductsGraphic from '@/components/PopularProductsGraphic'
import Product from '@/components/Product'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store'

export default function HomePage() {
  const { user } = useStore()

  const itemsPerPage = 8

  return (
    <Tabs defaultValue="products" className="mx-10 mt-2 max-sm:mx-2">
      <TabsList
        className={`grid w-full ${user?.admin ? 'grid-cols-3' : 'grid-cols-1'}`}
      >
        <TabsTrigger value="products">Produtos</TabsTrigger>
        {user?.admin && (
          <>
            <TabsTrigger value="control">Controle</TabsTrigger>
            <TabsTrigger value="graphic">Gráfico</TabsTrigger>
          </>
        )}
      </TabsList>
      <TabsContent value="products">
        <Product itemsPerPage={itemsPerPage} />
      </TabsContent>
      <TabsContent value="control">
        <Control itemsPerPage={itemsPerPage} />
      </TabsContent>
      <TabsContent value="graphic">
        <PopularProductsGraphic />
      </TabsContent>
    </Tabs>
  )
}
