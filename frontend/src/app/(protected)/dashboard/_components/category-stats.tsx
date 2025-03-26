"use client"

import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { useEffect, useState } from "react"
import SkeletonWrapper from "@/components/skeleton-wrapper"

interface CategoryStats {
  id: string
  name: string
  icon: string
  amount: string
}

interface Category {
  category: string
  amount: string
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export default function CategoryStats({ currentMonth }: { currentMonth: string }) {
  const axiosPrivate = useAxiosPrivate()
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({})
  const [loading, setLoading] = useState(true)

  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  useEffect(() => {
    async function getCategoryStats() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/transactions/category")
        setChartConfig(
          response.data.data.reduce((acc: ChartConfig, category: Category) => {
            acc[category.category.toLowerCase()] = {
              label: category.category.toLowerCase(),
              color: getRandomColor()
            };
            return acc;
          }, {})
        )
        setCategoryStats(
          response.data.data.map((category: Category) => ({
            category: category.category.toLowerCase(),
            amount: Number(category.amount),
            fill: `var(--color-${category.category.toLowerCase()})`
          }))
        )
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getCategoryStats()
  }, [])

  if (loading) {
    return (
      <SkeletonWrapper isLoading={loading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
          <CardContent>
            Loading
          </CardContent>
        </Card>
      </SkeletonWrapper>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{currentMonth} Category Expenses</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categoryStats}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {categoryStats.reduce((sum: number, item: CategoryStats) => sum + Number(item.amount), 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Expense
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

