import BankStats from "./_components/bank-stats";
import CategoryStats from "./_components/category-stats";
import History from "./_components/history";
import Overview from "./_components/overview";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-4 flex flex-col gap-4">
        <Overview />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CategoryStats />
          <BankStats />
        </div>
        <History />
      </div>
    </div>
  )
}

