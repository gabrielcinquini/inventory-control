import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { generateRandomColorsArray } from '@/hooks/GenerateColors'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface LabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  value: number
  index: number
}

export default function PopularProductsGraphic() {
  const numberOfColors = 10
  const randomColorsArray = generateRandomColorsArray(numberOfColors)

  const { data: controlsGraphic, isLoading } = useQuery({
    queryFn: () => getControlsGraphic(),
    queryKey: ['controlsGraphic'],
  })

  const getControlsGraphic = async () => {
    const response = await axios.get('/api/control/graphic')
    return response.data
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <Card className="col-span-3">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Top 10 produtos populares
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="z-10">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart style={{ fontSize: 12 }} data={controlsGraphic}>
            <Pie
              data={controlsGraphic}
              dataKey="amount"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }: LabelProps) => {
                const RADIAN = Math.PI / 180
                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {controlsGraphic[index].product.length > 18
                      ? controlsGraphic[index].product
                          .substring(0, 18)
                          .concat('...')
                      : controlsGraphic[index].product}{' '}
                    ({value})
                  </text>
                )
              }}
            >
              {controlsGraphic.map((_: undefined, index: number) => {
                return (
                  <Cell key={`cell-${index}`} fill={randomColorsArray[index]} />
                )
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
