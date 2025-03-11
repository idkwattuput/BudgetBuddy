"use client"

import { Card } from "@/components/ui/card";
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Budget } from "../page";
import { Button } from "@/components/ui/button";
import CategoryComboBox from "../../transaction/_components/category-combo-box";

interface Props {
  onChange: (budget: Budget) => void
}

const FormSchema = z.object({
  limit: z.string().min(3).max(20),
  categoryId: z.string().min(1),
});


export default function CreateBudgetDialog({ onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/budgets",
        JSON.stringify({
          limit: data.limit,
          categoryId: data.categoryId,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      form.reset({
        limit: "",
        categoryId: "",
      })
      toast.success(`Budget created`)
      onChange(response.data.data)
      setPending(false)
      setOpen((prev) => !prev)
    } catch (error) {
      console.error(error)
      setPending(false)
    }
  }

  const handleCategoryChange = useCallback((categoryId: string) => {
    form.setValue("categoryId", categoryId)
  }, [form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Card className="h-full p-4 flex justify-center items-center gap-2 bg-muted">
          <Plus />
          <h1 className="text-xl font-bold">Add Budget</h1>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new budget</DialogTitle>
          <DialogDescription>You can use bank info to trace transaction easily</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryComboBox type={"EXPENSE"} onChange={handleCategoryChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => { form.reset() }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={pending}>
            {!pending && "Create"}
            {pending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

