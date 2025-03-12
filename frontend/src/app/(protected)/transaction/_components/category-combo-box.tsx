"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import CreateCategoryDialog from "./create-category-dialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Category } from "../../category/page"
import SkeletonWrapper from "@/components/skeleton-wrapper"

interface Props {
  type: "INCOME" | "EXPENSE"
  onChange: (categoryId: string) => void
}

export default function CategoryComboBox({ type, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!value) return;
    onChange(categoryId)
  }, [onChange, value, categoryId])

  useEffect(() => {
    async function getCategory() {
      try {
        const response = await axiosPrivate.get(`/api/v1/category?type=${type}`)
        setCategories(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getCategory();
  }, [])

  const selectedCategory = categories.find((category) => category.name === value)

  const successCallback = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category])
    setValue(category.name)
    setCategoryId(category.id)
    onChange(category.id)
    setOpen((prev) => !prev)
  }, [setValue, setOpen])

  return (
    <SkeletonWrapper isLoading={loading}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            {selectedCategory ? (
              <CategoryRow category={selectedCategory} />
            ) : (
              "Select category"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command onSubmit={(e) => {
            e.preventDefault()
          }}>
            <CommandInput placeholder="Search category..." />
            <CreateCategoryDialog type={type} successCallback={successCallback} />
            <CommandEmpty>
              <p>Category not found</p>
              <p className="text-xs text-muted-foreground">Tip: Create a new category</p>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {
                  categories && categories.map((category: Category) => (
                    <CommandItem
                      key={category.name}
                      onSelect={() => {
                        setValue(category.name)
                        setCategoryId(category.id)
                        setOpen((prev) => !prev)
                      }}
                    >
                      <CategoryRow category={category} />
                      <Check className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"

                      )} />
                    </CommandItem>
                  ))
                }
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </SkeletonWrapper>
  )
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  )
}
