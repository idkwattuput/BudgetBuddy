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
import { useState } from "react";
import { toast } from "sonner";
import { Bank } from "../page";
import { Button } from "@/components/ui/button";

interface Props {
  onChange: (bank: Bank) => void
}

const FormSchema = z.object({
  bankName: z.string().min(3).max(20),
  accountName: z.string().min(3).max(20),
});


export default function CreateBankDialog({ onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/banks",
        JSON.stringify({
          bankName: data.bankName,
          accountName: data.accountName,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      form.reset({
        bankName: "",
        accountName: "",
      })
      toast.success(`${data.bankName} created`)
      onChange(response.data.data)
      setPending(false)
      setOpen((prev) => !prev)
    } catch (error) {
      console.error(error)
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Card className="h-full p-4 flex justify-center items-center gap-2 bg-muted border-dashed border-2 border-muted-foreground">
          <Plus />
          <h1 className="text-xl font-bold">Create New Bank</h1>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Bank</DialogTitle>
          <DialogDescription>You can use bank info to trace transaction easily</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

