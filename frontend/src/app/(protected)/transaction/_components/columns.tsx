"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import DeleteTransaction from "./delete-transaction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  id: string
  description: string
  amount: number
  type: "INCOME" | "EXPENSE"
  date: Date
  category: { name: string, icon: string },
  user_id: string
  user: { currency: string }
  created_date: Date
  updated_date: Date
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="text-center">Date</div>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      const formattedDate = date.toLocaleString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
      return <div className="text-center">{formattedDate}</div>
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <div className="text-center">Description</div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.description}</div>
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <div className="text-center">Category</div>
      )
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize items-center justify-center">
        {row.original.category.icon}
        <div className="capitalize">{row.original.category.name}</div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-center">Amount</div>
      )
    },
    cell: ({ row }) => (
      <div className="flex gap-1 justify-center items-center">
        <span>{row.original.user.currency}</span>
        {Number(row.original.amount).toFixed(2)}
      </div>
    )
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div className="text-center">Type</div>
      )
    },
    cell: ({ row }) => (
      <div className={cn(
        "rounded-lg p-2 text-center capitalize",
        row.original.type === "INCOME" ? "text-emerald-500 bg-emerald-400/10" : "text-red-500 bg-red-400/10"
      )}>{row.original.type}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DeleteTransaction id={row.original.id} />
      )
    },
  },
]
