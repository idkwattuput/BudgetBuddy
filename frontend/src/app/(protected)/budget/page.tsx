"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import CreateBudgetDialog from "./_components/create-budget-dialog"
import { useEffect, useState } from "react"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BudgetFeed from "./_components/budget-feed"
import { Category } from "../category/page"

export interface Budget {
  id: string
  limit: number
  spend: number
  category_id: string
  category: Category
  user_id: string
  user: { currency: string }
  created_at: string
  updated_at: string
}

export default function Budget() {
  const axiosPrivate = useAxiosPrivate()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getBudgets() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/budgets")
        setBudgets(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getBudgets()
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

  function handleNewBudget(budget: Budget) {
    setBudgets((prev) => [...prev, budget])
  }

  function handleDeleteBudget(id: string) {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Budget</h1>
      <div className="h-full mt-4 grid grid-cols-3 gap-4">
        <CreateBudgetDialog onChange={handleNewBudget} />
        {budgets.length > 0 && (
          budgets.map((budget) => {
            const percentageUsed = (budget.spend / budget.limit) * 100
            return (
              <BudgetFeed key={budget.id} budget={budget} percentageUsed={percentageUsed} onChange={handleDeleteBudget} />
            )
          })
        )}
      </div>
    </div>
  )
}

