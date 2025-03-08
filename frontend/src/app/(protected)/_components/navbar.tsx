"use client";

import { ModeToggle } from "@/components/theme-toggle-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import axios from "@/lib/axios";
import {
  CircleDollarSign,
  CircleUser,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const mobileItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transaction", href: "/transaction", },
  { label: "Budget", href: "/budget", },
  { label: "Bank", href: "/bank", },
]

export default function Navbar() {
  const router = useRouter()

  async function logout() {
    try {
      await axios.get("/api/v1/auth/logout", {
        withCredentials: true,
      })
      router.push("/login")
    } catch (error) {
      console.error((error))
    }
  }

  return (
    <>
      <DesktopNavbar />
      <MobileNavbar logout={logout} />
    </>
  );
}

interface Props {
  logout: () => void
}

function DesktopNavbar() {
  return (
    <nav className="hidden p-4 lg:flex justify-between items-center border-b border-muted">
      <div className="flex items-center gap-2">
        <CircleDollarSign className="text-primary h-8 w-8" />
        <h1 className="text-3xl font-bold ">Budget Buddy</h1>
      </div>
      <ul className="flex items-center ">
        <ModeToggle />
      </ul>
    </nav>

  )
}

function MobileNavbar({ logout }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex lg:hidden justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <CircleDollarSign className="text-primary" />
        <h1 className="text-2xl font-bold ">Budget Buddy</h1>
      </div>

      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side={"right"}>
            <SheetHeader>
              <div className="flex justify-center items-center mb-2 gap-2">
                <CircleDollarSign className="text-primary" />
                <SheetTitle className="text-2xl">Budget Buddy</SheetTitle>
              </div>
            </SheetHeader>
            <div className="max-h-[850px] h-full flex flex-col justify-between items-center">
              <div className="w-full flex flex-col justify-center items-center gap-4">
                {mobileItems.map((item) => (
                  <NavbarItem key={item.label} lable={item.label} link={item.href} clickCallback={() => {
                    setOpen((prev) => !prev)
                  }} />
                ))}
              </div>
              <Link
                href={"/"}
                className="w-full"
                onClick={logout}
              >
                <Button variant={"destructive"} className="w-full">
                  Logout
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

function NavbarItem({ lable, link, clickCallback }: { lable: string; link: string, clickCallback?: () => void }) {
  const currentPath = usePathname();
  const isActive = currentPath === link;


  return (
    <Link href={link}
      className="w-full"
      onClick={() => {
        if (clickCallback) clickCallback()
      }}
    >
      {isActive ? (
        <Button variant="secondary" className="font-bold w-full">
          {lable}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full">{lable}</Button>
      )}
    </Link>
  );
}
