"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CircleDollarSign } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import CurrencyComboBox from "./_components/currency-combo-box";
import { getUserJWT, setAccessToken } from '@/lib/cookies'
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FormSchema = z.object({
  currency: z.string().min(1, {
    message: "Please select currency"
  })
})

export default function Setup() {
  const axiosPrivate = useAxiosPrivate()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currency: "",
    },
  });

  const handleCurrencyChange = useCallback((value: string) => {
    form.setValue("currency", value)
  }, [form])

  useEffect(() => {
    async function getUser() {
      setLoading(true)
      const user = await getUserJWT()
      setFullName(`${user.first_name} ${user.last_name}`)
      setLoading(false)
    }

    getUser()
  }, [setLoading])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await axiosPrivate.put("/api/v1/users/currency",
        JSON.stringify({
          currency: data.currency
        })
      )
      setAccessToken(response.data.accessToken)
      toast.success("Welcome to Budget Buddy 🎉")
      router.push("/dashboard")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div>
        <h1 className="text-center text-3xl">Welcome
          <SkeletonWrapper isLoading={loading} >
            <span className="ml-2 font-bold">{fullName}!</span>
          </SkeletonWrapper>
        </h1>
        <p className="text-center text-muted-foreground">Let&apos; get started by setting up your currency</p>
        <p className="text-center text-sm text-muted-foreground">You can change these settings at any time</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="my-4">
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>Set your primary currency for transaction</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          <Button type="submit" className="w-full">I&apos;m done! Take me to the dashboard</Button>
        </form>
      </Form>
      <div className="mt-4 flex items-center gap-2">
        <CircleDollarSign className="h-8 w-8" />
        <h1 className="text-3xl font-bold font-header">Budget Buddy</h1>
      </div>
    </div>
  )
}
