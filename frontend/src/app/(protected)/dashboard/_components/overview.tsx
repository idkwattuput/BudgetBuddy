"use client"

import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { HandCoins, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Overview {
  currency: string,
  income: string
  expense: string
}

export default function Overview() {
  const axiosPrivate = useAxiosPrivate()
  const [stats, setStats] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStats() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/transactions/overview")
        setStats(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4">
      <SkeletonWrapper isLoading={loading}>
        <Card className="md:col-span-4 lg:col-span-1">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="flex gap-2">
              <HandCoins />
              <span className="text-muted-foreground">Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="font-bold text-4xl flex justify-center items-center">
            <h2 className="mr-2">{stats?.currency || "$"}</h2>
            <h2>{Number((Number(stats?.income) || 0) - (Number(stats?.expense) || 0)).toFixed(2)}</h2>
          </CardContent>
        </Card>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={loading}>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="flex gap-2">
              <TrendingUp className="text-green-400" />
              <span className="text-muted-foreground">Income</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="font-bold text-4xl flex justify-center items-center">
            <h2 className="mr-2">{stats?.currency || "$"}</h2>
            <h2>{Number(stats?.income || 0).toFixed(2)}</h2>
          </CardContent>
        </Card>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={loading}>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="flex gap-2">
              <TrendingDown className="text-red-400" />
              <span className="text-muted-foreground">Expense</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="font-bold text-4xl flex justify-center items-center">
            <h2 className="mr-2">{stats?.currency || "$"}</h2>
            <h2>{Number(stats?.expense || 0).toFixed(2)}</h2>
          </CardContent>
        </Card>
      </SkeletonWrapper>
    </div>
  );
}
