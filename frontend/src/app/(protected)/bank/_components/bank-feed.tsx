import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bank } from "../page"
import DeleteBankDialog from "./delete-bank-dialog"

interface Props {
  bank: Bank
  onChange: (id: string) => void
}

export default function BankFeed({ bank, onChange }: Props) {
  return (
    <Card>
      <CardHeader className="justify-center items-center">
        <CardTitle>{bank.bank_name}</CardTitle>
        <CardDescription>{bank.account_name}</CardDescription>
      </CardHeader>
      <CardFooter>
        <DeleteBankDialog bank={bank} onChange={onChange} />
      </CardFooter>
    </Card>
  )
}

