import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        <CardTitle className="flex justify-between items-center">
          <div className="">
            <Button variant="secondary" size="icon" className="rounded-full">
              {budget.category.icon}
            </Button>
            <span className="ml-2">{budget.category.name}</span>
          </div>
          <DeleteBudgetDialog budget={budget} onChange={onChange} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-1">
          <p>Budget: {budget.user.currency}{budget.limit}</p>
          <p>{percentageUsed.toFixed(2)}%</p>
        </div>
        <Progress value={percentageUsed} />
        <div className="mt-1 flex justify-between items-center">
          <p className=" text-sm">Spend: {budget.user.currency}{budget.spend}</p>
          <p className="text-muted-foreground text-sm">Remaining: {budget.user.currency}{budget.limit - budget.spend}</p>
        </div>
      </CardContent>
    </Card>
  )
}

