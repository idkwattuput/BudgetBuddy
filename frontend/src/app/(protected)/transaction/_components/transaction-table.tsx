"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Button } from "@/components/ui/button"
import { Category } from "../../category/page"
import { DataTableFacetedFilter } from "@/components/datatable/faceted-filters"
import { Bank } from "../../bank/page"

interface FilterProps {
  id: string
  value: string
  label: string
  type: string
}

export default function TransactionTable() {
  const axiosPrivate = useAxiosPrivate()
  const [data, setData] = useState([])
  const [categories, setCategories] = useState<FilterProps[]>([])
  const [categoriesMap, setCategoriesMap] = useState<string[]>([])
  const [banks, setBanks] = useState<FilterProps[]>([])
  const [banksMap, setBanksMap] = useState<string[]>([])
  const [types, setTypes] = useState<FilterProps[]>([
    { id: "1", value: "INCOME", label: "Income", type: "type" },
    { id: "2", value: "EXPENSE", label: "Expense", type: "type" }
  ])
  const [typesMap, setTypesMap] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(
          `/api/v1/transactions`,
          {
            params: {
              page,
              categoryIds: categoriesMap.length > 0 ? categoriesMap : "",
              bankIds: banksMap.length > 0 ? banksMap : "",
              types: typesMap.length > 0 ? typesMap : "",
            },
          }
        );
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
        const response = await axiosPrivate.get(
          `/api/v1/transactions`,
          {
            params: {
              page,
              categoryIds: categoriesMap.length > 0 ? categoriesMap : "",
              bankIds: banksMap.length > 0 ? banksMap : "",
              types: typesMap.length > 0 ? typesMap : "",
            },
          }
        );
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
  }, [page, categoriesMap, banksMap, typesMap])

  function handleFilterChange(value: string, type: string) {
    if (type === "category") {
      setCategoriesMap((prev) => [...prev, value])
    } else if (type === "bank") {
      setBanksMap((prev) => [...prev, value])
    } else {
      setTypesMap((prev) => [...prev, value])
    }
  }

  function handleRemoveFilterChange(value: string, type: string) {
    if (type === "category") {
      setCategoriesMap((prev) => prev.filter((p) => p !== value))
    } else if (type === "bank") {
      setBanksMap((prev) => prev.filter((p) => p !== value))
    } else {
      setTypesMap((prev) => prev.filter((p) => p !== value))
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <DataTableFacetedFilter title="Category" type={"category"} onChange={handleFilterChange} onDelete={handleRemoveFilterChange} />
        <DataTableFacetedFilter title="Bank" type={"bank"} onChange={handleFilterChange} onDelete={handleRemoveFilterChange} />
        <DataTableFacetedFilter title="Type" type={"type"} onChange={handleFilterChange} onDelete={handleRemoveFilterChange} />
      </div>
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
