"use client"

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReactNode, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryComboBox from "./category-combo-box";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { toast } from "sonner";
import BankComboBox from "./bank-combo-box";

interface Props {
  children: ReactNode,
  type: "INCOME" | "EXPENSE"
}

const FormSchema = z.object({
  description: z.string().min(3),
  amount: z.coerce.number().positive().multipleOf(0.01),
  bankId: z.string().optional(),
  categoryId: z.string(),
  date: z.coerce.date(),
  type: z.union([
    z.literal("INCOME"),
    z.literal("EXPENSE"),
  ])
});

export default function AddTransactionDialog({ children, type }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      bankId: "",
      type: type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback((categoryId: string) => {
    form.setValue("categoryId", categoryId)
  }, [form])

  const handleBankChange = useCallback((bankId: string) => {
    form.setValue("bankId", bankId)
  }, [form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      await axiosPrivate.post("/api/v1/transactions",
        JSON.stringify({
          description: data.description,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId,
          bankId: data.bankId || null,
          date: data.date
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      form.reset({
        description: "",
        amount: 0,
        categoryId: "",
        date: new Date(),
        type
      })

      toast.success("Transaction created successfully 🎉")
      window.dispatchEvent(new Event("transactionChange"))
      setPending(false)
      setOpen((prev) => !prev)
    } catch (error) {
      console.log(error)
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a new{" "}
            <span
              className={cn(
                "m-1",
                type === "INCOME" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type.toLowerCase()}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankId"
                render={({ }) => (
                  <FormItem>
                    <FormLabel>Bank</FormLabel>
                    <FormControl>
                      <BankComboBox onChange={handleBankChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryComboBox type={type} onChange={handleCategoryChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
