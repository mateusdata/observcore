"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Menu, LogIn, UserPlus, X } from "lucide-react"
import { ModeToggle } from "@/components/ui/mode-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"

export default function HeaderPublic() {
  const mobileNav = (
    <div className="flex flex-col">
      <SheetHeader className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Activity className="h-6 w-6 text-primary" />
          <span>ObservCore</span>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <nav className="flex flex-col gap-2 p-6">
        <SheetClose asChild>
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            <LogIn className="h-5 w-5" />
            Entrar
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Link
            href="/register"
            className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Criar Conta
          </Link>
        </SheetClose>
      </nav>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-base md:text-lg lg:text-xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-0">
              {mobileNav}
            </SheetContent>
          </Sheet>

          <Activity className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
          <span className="truncate">ObservCore</span>
        </div>

        <nav className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Criar Conta</Button>
          </Link>
          <ModeToggle />
        </nav>

        <div className="flex md:hidden">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}