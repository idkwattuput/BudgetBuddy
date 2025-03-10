"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteTransaction({ id }: { id: string }) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleDeleteTransaction(id: string) {
    try {
      setPending(true)
      await axiosPrivate.delete(`/api/v1/transactions/${id}`)
      toast.success("Transaction successfully deleted 🎉")
      window.dispatchEvent(new Event("transactionChange"))
      setPending(false)
      setOpen(false)
    } catch (error) {
      setPending(false)
      setOpen(false)
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. This will permanently delete your transaction.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            disabled={pending}
            onClick={async () => await handleDeleteTransaction(id)}>
            {!pending && "Delete"}
            {pending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
