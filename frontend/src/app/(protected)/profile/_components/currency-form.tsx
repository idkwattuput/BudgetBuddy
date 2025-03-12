"use client"

import CurrencyComboBox from "@/app/setup/_components/currency-combo-box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  currency: z.string().min(1, {
    message: "Please select currency"
  })
})

export default function CurrencyForm() {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currency: "",
    },
  });

  const handleCurrencyChange = useCallback((value: string) => {
    form.setValue("currency", value, { shouldDirty: true })
  }, [form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      await axiosPrivate.put("/api/v1/users/currency",
        JSON.stringify({
          currency: data.currency
        })
      )
      form.reset()
      toast.success("Currency updated")
      setPending(false)
    } catch (error) {
      console.log(error)
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="currency"
          render={({ }) => (
            <FormItem className="grid gap-2">
              <FormControl>
                <CurrencyComboBox onChange={handleCurrencyChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center gap-4">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || pending}
          >
            {pending ? (<Loader2 className="animate-spin" />) : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

