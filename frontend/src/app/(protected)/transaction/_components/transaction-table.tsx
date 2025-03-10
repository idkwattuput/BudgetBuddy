"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Button } from "@/components/ui/button"


export default function TransactionTable() {
  const axiosPrivate = useAxiosPrivate()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(`/api/v1/transactions?page=${page}`)
        setData(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    async function getUpdatedData() {
      try {
        setLoading(false)
        const response = await axiosPrivate.get(`/api/v1/transactions?page=${page}`)
        setData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    getData()

    const handleTransactionChange = () => {
      getUpdatedData();
    };

    window.addEventListener("transactionChange", handleTransactionChange);

    return () => {
      window.removeEventListener("transactionChange", handleTransactionChange);
    };
  }, [page])

  return (
    <div className="mt-4">
      <SkeletonWrapper isLoading={loading}>
        <DataTable columns={columns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={data.length <= 0 || data.length < 10}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  )
}
