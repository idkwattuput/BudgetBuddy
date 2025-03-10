import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Bank } from "../page"
import DeleteBankDialog from "./delete-bank-dialog"

interface Props {
  bank: Bank
  onChange: (id: string) => void
}

export default function BankFeed({ bank, onChange }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="flex-1 flex-col gap-1.5 justify-center items-center">
          <CardTitle>{bank.bank_name}</CardTitle>
          {bank.account_name}
        </div>
        <DeleteBankDialog bank={bank} onChange={onChange} />
      </CardHeader>
    </Card>
  )
}

