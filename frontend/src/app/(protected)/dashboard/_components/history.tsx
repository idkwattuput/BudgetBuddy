"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { useEffect, useState } from "react"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Card } from "@/components/ui/card"

const chartConfig = {
  income: {
    label: "Income",
    color: "#10b981",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
} satisfies ChartConfig

interface TransactionSummary {
  month: string
  income: number
  expense: number
}

export default function History() {
  const axiosPrivate = useAxiosPrivate()
  const [transactions, setTransactions] = useState<TransactionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTransactions() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(`/api/v1/transactions/history`)
        setTransactions(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    getTransactions()
  }, [])

  return (
    <SkeletonWrapper isLoading={loading}>
      <Card className="p-4">
        <ChartContainer config={chartConfig} className="max-h-[800px] w-full">
          <BarChart data={transactions} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill={chartConfig.income.color} radius={4} />
            <Bar dataKey="expense" fill={chartConfig.expense.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </Card>
    </SkeletonWrapper>
  )
}
