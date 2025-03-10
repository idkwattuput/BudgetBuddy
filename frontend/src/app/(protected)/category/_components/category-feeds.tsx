import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "../page"
import DeleteCategoryDialog from "./delete-category-dialog"

interface Props {
  category: Category
  onChange: (id: string, type: "INCOME" | "EXPENSE") => void
}

export default function CategoryFeeds({ category, onChange }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="flex-1 flex-col gap-1.5 justify-center items-center">
          {category.icon}
          <CardTitle>{category.name}</CardTitle>
        </div>
        <DeleteCategoryDialog category={category} onChange={onChange} />
      </CardHeader>
    </Card>
  )
}

