import BankStats from "./_components/bank-stats";
import CategoryStats from "./_components/category-stats";
import History from "./_components/history";
import Overview from "./_components/overview";

export default function Dashboard() {
  const date = new Date()
  const currentMonth = date.toLocaleString("en-US", { month: "long" })
  return (
    <div>
      <h1 className="text-3xl">Overview In <span className="font-bold">{currentMonth}</span></h1>
      <div className="mt-4 flex flex-col gap-4">
        <Overview />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CategoryStats currentMonth={currentMonth} />
          <BankStats currentMonth={currentMonth} />
        </div>
        <h1 className="text-3xl">Transactions History In <span className="font-bold">{date.getFullYear()}</span></h1>
        <History />
      </div>
    </div>
  )
}

