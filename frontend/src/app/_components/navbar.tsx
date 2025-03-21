import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="px-32 py-10 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <CircleDollarSign className="h-8 w-8" />
        <h1 className="text-3xl font-bold ">Budget Buddy</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link href={"/login"}>
          <Button variant={"secondary"}>Sign In</Button>
        </Link>
        <Link href={"/register"}>
          <Button>Sign Up</Button>
        </Link>
      </div>
    </div>
  )
}

