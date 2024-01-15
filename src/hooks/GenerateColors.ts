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
