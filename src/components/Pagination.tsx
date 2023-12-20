import React from 'react'
import { Button } from './ui/button'

type PaginationType = {
  currentPage: number
  totalPages: number
  setCurrentPage: (value: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationType) {
  return (
    <>
      <Button
        onClick={() => {
          setCurrentPage(currentPage - 1)
        }}
        disabled={currentPage === 1}
        className={`${
          currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        Anterior
      </Button>
      <span className="ml-4 mr-4 py-2">
        {currentPage}/{totalPages}
      </span>
      <Button
        onClick={() => {
          setCurrentPage(currentPage + 1)
        }}
        disabled={currentPage === totalPages}
        className={`${
          currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        Próxima
      </Button>
    </>
  )
}
