"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { Bank } from "../../bank/page"
import CreateBankDialog from "./create-bank-dialog"
import SkeletonWrapper from "@/components/skeleton-wrapper"

interface Props {
  onChange: (bankId: string) => void
}

export default function BankComboBox({ onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [bankId, setBankId] = useState("")
  const [banks, setBanks] = useState<Bank[]>([])

  useEffect(() => {
    if (!value) return;
    onChange(bankId)
  }, [onChange, value, bankId])

  useEffect(() => {
    async function getBanks() {
      try {
        const response = await axiosPrivate.get(`/api/v1/banks`)
        setBanks(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getBanks();
  }, [])

  const selectedBank = banks.find((bank) => bank.account_name === value)

  const successCallback = useCallback((bank: Bank) => {
    setBanks((prev) => [...prev, bank])
    setValue(bank.account_name)
    setBankId(bank.id)
    onChange(bank.id)
    setOpen((prev) => !prev)
  }, [setValue, setOpen])

  return (
    <SkeletonWrapper isLoading={loading}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            {selectedBank ? (
              <BankRow bank={selectedBank} />
            ) : (
              "Select bank"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command onSubmit={(e) => {
            e.preventDefault()
          }}>
            <CommandInput placeholder="Search bank..." />
            <CreateBankDialog onChange={successCallback} />
            <CommandEmpty>
              <p>Bank not found</p>
              <p className="text-xs text-muted-foreground">Tip: Create a new bank</p>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {
                  banks && banks.map((bank: Bank) => (
                    <CommandItem
                      key={bank.id}
                      onSelect={() => {
                        setValue(bank.account_name)
                        setBankId(bank.id)
                        setOpen((prev) => !prev)
                      }}
                    >
                      <BankRow bank={bank} />
                      <Check className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === bank.account_name && "opacity-100"

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

function BankRow({ bank }: { bank: Bank }) {
  return (
    <div className="flex items-center gap-2">
      <span>{bank.bank_name}({bank.account_name})</span>
    </div>
  )
}
