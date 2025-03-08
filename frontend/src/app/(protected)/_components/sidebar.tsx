"use client"

import { Button } from "@/components/ui/button";
import { Banknote, Building, HandCoins, House } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Sidebar() {
  const items = [
    { label: "Dashboard", href: "/dashboard", icon: (<House />) },
    { label: "Transaction", href: "/transaction", icon: (<HandCoins />) },
    { label: "Budget", href: "/budget", icon: (<Banknote />) },
    { label: "Bank", href: "/bank", icon: (<Building />) },
  ]

  return (
    <aside className="p-4 hidden lg:w-[250px] xl:w-[300px] lg:flex flex-col justify-between items-center border-r border-muted">
      <div className="w-full flex flex-col gap-4">
        {items.map((item) => (
          <NavbarItem key={item.label} lable={item.label} link={item.href} icon={item.icon} />
        ))}
      </div>
    </aside>
  )
}

function NavbarItem({ lable, link, icon }: { lable: string; link: string; icon: ReactNode; }) {
  const currentPath = usePathname();
  const isActive = currentPath === link;

  return (
    <Link href={link}
      className="w-full"
    >
      {isActive ? (
        <Button variant="secondary" className="font-bold w-full flex justify-start items-center">
          {icon}
          {lable}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full flex justify-start items-center">
          {icon}
          {lable}
        </Button>
      )}
    </Link>
  );
}

