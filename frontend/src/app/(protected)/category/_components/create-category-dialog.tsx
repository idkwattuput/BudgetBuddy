"use client"

import { Button } from "@/components/ui/button"
import { CircleOff, Loader2 } from "lucide-react";
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Category } from "../page";

interface Props {
  children: ReactNode
  type: "EXPENSE" | "INCOME"
  onChange: (category: Category, type: "INCOME" | "EXPENSE") => void
}

const FormSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["INCOME", "EXPENSE"])
});

export default function CreateCategoryDialog({ children, type, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: type,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/category",
        JSON.stringify({
          name: data.name,
          icon: data.icon,
          type: data.type
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      form.reset({
        name: "",
        icon: "",
        type
      })
      toast.success(`Category ${data.name} created`)
      onChange(response.data.data, type)
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
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create new
            <span
              className={cn(
                "m-1 lowercase",
                type === "INCOME" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span> category
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>This action will permenantly create new <span className="lowercase">{type}</span> category</DialogDescription>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category"{...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">{field.value}</span>
                              <p className="text-xs text-muted-foreground">Click to change</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">Click to select</p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native)
                          }} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"} onClick={() => {
              form.reset()
            }}>
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

