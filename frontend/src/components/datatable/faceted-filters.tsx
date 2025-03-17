import * as React from "react"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Category } from "@/app/(protected)/category/page"
import { Bank } from "@/app/(protected)/bank/page"

interface DataTableFacetedFilterProps {
  title?: string
  type: string
  onChange: (value: string[], type: string) => void
}

interface Options {
  id: string
  label: string
  value: string
  type: string
  icon?: React.ComponentType<{ className?: string }>
}

type CategoryOrBank = Category & Bank;

export function DataTableFacetedFilter({
  title,
  type,
  onChange,
}: DataTableFacetedFilterProps) {
  const axiosPrivate = useAxiosPrivate()
  const [selectedValues, setSelectedValues] = useState(new Set<string>())
  const [options, setOptions] = useState<Options[]>([])

  useEffect(() => {
    async function getData() {
      try {
        console.log("getData")
        const api = type === "category" ? "category" : "banks"
        const response = await axiosPrivate.get(`/api/v1/${api}`)
        const optionsMap = new Map()
        response.data.data.forEach((o: CategoryOrBank) => {
          optionsMap.set(o.name, {
            id: o.id,
            value: type === "category" ? o.name : o.bank_name,
            label: type === "category" ? `${o.icon} ${o.name}` : o.bank_name,
            type: type
          })
        })
        const uniqueCategories = new Set(optionsMap.values())
        setOptions(Array.from(uniqueCategories))
      } catch (error) {
        console.log(error)
      }
    }
    if (type !== "type") {
      getData()
    } else {
      setOptions([
        { id: "1", value: "INCOME", label: "Income", type: "type" },
        { id: "2", value: "EXPENSE", label: "Expense", type: "type" }
      ])
    }
  }, [])

  useEffect(() => {
    onChange(Array.from(selectedValues), type)
  }, [selectedValues])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => option.type === "type" ? selectedValues.has(option.value) : selectedValues.has(option.id))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.type === "type" ? selectedValues.has(option.value) : selectedValues.has(option.id)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => setSelectedValues((prev) => {
                      const newSelected = new Set(prev)
                      if (newSelected.has(option.value)) {
                        newSelected.delete(option.value)
                      } else if (newSelected.has(option.id)) {
                        newSelected.delete(option.id)
                      } else {
                        if (option.type === "type") {
                          newSelected.add(option.value)
                        } else {
                          newSelected.add(option.id)
                        }
                      }
                      return newSelected
                    })}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedValues(new Set())}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
