import { Button } from "@/components/ui/button";
import AddTransactionDialog from "./_components/add-transaction-dialog";
import TransactionTable from "./_components/transaction-table";

export default function Transaction() {
  return (
    <div>
      <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-bold">Transaction</h1>
        <div className="flex items-center gap-4">
          <AddTransactionDialog type="INCOME">
            <Button
              variant={"outline"}
              className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700"
            >
              Add Income
            </Button>
          </AddTransactionDialog>
          <AddTransactionDialog type="EXPENSE">
            <Button
              variant={"outline"}
              className="border-red-500 bg-red-950 text-white hover:bg-red-700"
            >
              Add Expense
            </Button>
          </AddTransactionDialog>
        </div>
      </div>
      <TransactionTable />
    </div>
  )
}

