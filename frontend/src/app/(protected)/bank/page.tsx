"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import CreateBankDialog from "./_components/create-bank-dialog"
import { useEffect, useState } from "react"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BankFeed from "./_components/bank-feed"

export interface Bank {
  id: string
  bank_name: string
  account_name: string
  is_archive: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export default function Bank() {
  const axiosPrivate = useAxiosPrivate()
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getBanks() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/banks")
        setBanks(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getBanks()
  }, [])

  if (loading) {
    return (
      <SkeletonWrapper isLoading={loading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
          <CardContent>
            Loading
          </CardContent>
        </Card>
      </SkeletonWrapper>
    )
  }

  function handleNewBank(bank: Bank) {
    setBanks((prev) => [...prev, bank])
  }

  function handleArchiveBank(id: string) {
    setBanks((prev) => prev.filter((bank) => bank.id !== id))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Bank</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <CreateBankDialog onChange={handleNewBank} />
        {banks.length > 0 && (
          banks.map((bank) => (
            <BankFeed key={bank.id} bank={bank} onChange={handleArchiveBank} />
          ))
        )}
      </div>
    </div>
  )
}

