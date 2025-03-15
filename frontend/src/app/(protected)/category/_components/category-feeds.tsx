import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "../page"
import DeleteCategoryDialog from "./delete-category-dialog"
import { Button } from "@/components/ui/button"

interface Props {
  category: Category
  onChange: (id: string, type: "INCOME" | "EXPENSE") => void
}

export default function CategoryFeeds({ category, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex flex-col justify-between items-center">
          <Button variant="secondary" size="icon" className="rounded-full">
            {category.icon}
          </Button>
          <span className="ml-2">{category.name}</span>
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <DeleteCategoryDialog category={category} onChange={onChange} />
      </CardFooter>
    </Card>
  )
}

