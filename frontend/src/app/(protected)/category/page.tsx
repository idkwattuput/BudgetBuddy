"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCategoryDialog from "./_components/create-category-dialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/use-axios-private";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import CategoryFeeds from "./_components/category-feeds";

export interface Category {
  id: string
  name: string
  icon: string
  type: "INCOME" | "EXPENSE"
  user_id: string
  is_archive: boolean
  created_at: string
  updated_at: string
}

export default function Category() {
  const axiosPrivate = useAxiosPrivate()
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([])
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCategories() {
      try {
        setLoading(true)
        const responseIncome = await axiosPrivate.get(`/api/v1/category?type=INCOME`)
        const responseExpense = await axiosPrivate.get(`/api/v1/category?type=EXPENSE`)
        setIncomeCategories(responseIncome.data.data)
        setExpenseCategories(responseExpense.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getCategories()
  }, [])

  function handleNewCategory(category: Category, type: "INCOME" | "EXPENSE") {
    if (type === "INCOME") {
      setIncomeCategories((prev) => [...prev, category])
    } else {
      setExpenseCategories((prev) => [...prev, category])
    }
  }

  function handleArchiveCategory(id: string, type: "INCOME" | "EXPENSE") {
    if (type === "INCOME") {
      setIncomeCategories((prev) => prev.filter((c) => c.id !== id))
    } else {
      setExpenseCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

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
    <div>
      <h1 className="text-3xl font-bold">Category</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <CreateCategoryDialog type="INCOME" onChange={handleNewCategory}>
          <Card className="h-full p-4 flex justify-center items-center gap-2 bg-muted border-dashed border-2 border-muted-foreground">
            <Plus />
            <h1 className="text-xl font-bold">Add <span className="text-emerald-500">Income</span> Category</h1>
          </Card>
        </CreateCategoryDialog>
        {incomeCategories.length > 0 && (
          incomeCategories.map((category) => (
            <CategoryFeeds key={category.id} category={category} onChange={handleArchiveCategory} />
          ))
        )}
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <CreateCategoryDialog type="EXPENSE" onChange={handleNewCategory}>
          <Card className="h-full p-4 flex justify-center items-center gap-2 bg-muted border-dashed border-2 border-muted-foreground">
            <Plus />
            <h1 className="text-xl font-bold">Add <span className="text-red-500">Expense</span> Category</h1>
          </Card>
        </CreateCategoryDialog>
        {expenseCategories.length > 0 && (
          expenseCategories.map((category) => (
            <CategoryFeeds key={category.id} category={category} onChange={handleArchiveCategory} />
          ))
        )}
      </div>
    </div>
  )
}

