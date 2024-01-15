import { type QueryClient } from '@tanstack/react-query'

export function formatName(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value
  const currentPos = event.target.selectionStart || 0

  const newVal = currentValue.replace(/[\W_]|[\d]+/g, '').toLocaleLowerCase()
  const formattedValue = newVal.charAt(0).toUpperCase() + newVal.slice(1)
  event.target.value = formattedValue

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos
    event.target.selectionEnd = currentPos
  }
}

export function formatToNumber(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value.replace(/[^\d]/g, '')
  const currentPos = event.target.selectionStart || 0

  const formattedTextToNumber = currentValue.replace(/\D/g, '')

  event.target.value = formattedTextToNumber

  // Define a nova posição do cursor após a formatação
  const newPos = currentPos + formattedTextToNumber.length - currentValue.length
  event.target.setSelectionRange(newPos, newPos)
}

export const revalidatePath = (paths: string[], queryClient: QueryClient) => {
  paths.map((p) => queryClient.invalidateQueries({ queryKey: [p] }))
}

const generateRandomColor = () => {
  const red = Math.floor(Math.random() * 256)
  const green = Math.floor(Math.random() * 256)
  const blue = Math.floor(Math.random() * 256)
  return `rgb(${red}, ${green}, ${blue})`
}

export const generateRandomColorsArray = (numColors: number) => {
  const colorsArray = []
  for (let i = 0; i < numColors; i++) {
    colorsArray.push(generateRandomColor())
  }
  return colorsArray
}
