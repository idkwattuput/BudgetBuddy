import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Category } from "../page"
import { Button } from "@/components/ui/button"
import { Loader2, Trash } from "lucide-react"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  category: Category
  onChange: (id: string, type: "INCOME" | "EXPENSE") => void
}

export default function DeleteCategoryDialog({ category, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function deleteCategory() {
    try {
      setPending(true)
      await axiosPrivate.delete(`/api/v1/category/${category.id}`)
      onChange(category.id, category.type)
      toast.success(`Category ${category.icon} ${category.name} deleted`)
      setPending(false)
    } catch (error) {
      console.log(error)
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="w-full"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {category.icon} {category.name} category</DialogTitle>
          <DialogDescription>This action will permenantly delete this category.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={"secondary"}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={deleteCategory}
            disabled={pending}
          >
            {!pending && "Delete"}
            {pending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

