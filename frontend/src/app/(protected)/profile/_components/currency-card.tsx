import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CurrencyForm from "./currency-form";

export default function CurrencyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change currency</CardTitle>
        <CardDescription>You can change currency anytime you want</CardDescription>
      </CardHeader>
      <CardContent>
        <CurrencyForm />
      </CardContent>
    </Card>
  )
}

