import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center flex flex-col justify-center h-full items-center">
      <h1 className="text-5xl font-extrabold leading-tight  drop-shadow-lg">
        Take Control of Your Finances – Your Way
      </h1>
      <p className="mt-4 mb-2 text-lg text-muted-foreground max-w-2xl">
        Budget Buddy helps you track income & expenses across multiple accounts – no bank linking required!
      </p>
      <Link href={"/login"}>
        <Button>
          Get Started
        </Button>
      </Link>
    </section>

  )
}

