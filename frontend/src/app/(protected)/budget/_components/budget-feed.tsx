import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Budget } from "../page"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import DeleteBudgetDialog from "./delete-budget"

interface Props {
  budget: Budget
  percentageUsed: number
  onChange: (id: string) => void
}

export default function BudgetFeed({ budget, percentageUsed, onChange }: Props) {
  return (
    <Card key={budget.id}>
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="secondary" size="icon" className="rounded-full">
              {budget.category.icon}
            </Button>
            <span className="ml-2">{budget.category.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {budget.user.currency}{budget.limit}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end items-end mb-1">
          <p>{percentageUsed.toFixed(2)}%</p>
        </div>
        <Progress value={percentageUsed} />
        <div className="mt-1 flex justify-between items-center">
          <p className=" text-sm">Spend: {budget.user.currency}{budget.spend}</p>
          {Number(budget.spend) < Number(budget.limit) ? (
            <p className="text-muted-foreground text-sm">Remaining: {budget.user.currency}{Number(budget.limit - budget.spend).toFixed(2)}</p>
          ) : (
            <p className="text-destructive text-sm">Over budget: {budget.user.currency}{Number(budget.limit - budget.spend).toFixed(2)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <DeleteBudgetDialog budget={budget} onChange={onChange} />
      </CardFooter>
    </Card>
  )
}

