import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Budget } from "../page"
import { Button } from "@/components/ui/button"
import { Loader2, Trash } from "lucide-react"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  budget: Budget
  onChange: (id: string) => void
}

export default function DeleteBudgetDialog({ budget, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function deleteBank() {
    try {
      setPending(true)
      await axiosPrivate.delete(`/api/v1/budgets/${budget.id}`)
      onChange(budget.id)
      toast.success(`${budget.category.name} deleted`)
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
          <DialogTitle>Delete {budget.category.name}</DialogTitle>
          <DialogDescription>This action will permenantly delete this budget.</DialogDescription>
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
            onClick={deleteBank}
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

