"use client"

import Link from "next/link"
import { Activity, BarChart3, Settings, Server, AlertTriangle, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout, user } = useAuth()

  const navigationItems = (
    <div className="flex flex-col gap-2">
      <Link href="/dashboard" className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors bg-accent/50 text-accent-foreground">
        <BarChart3 className="mr-3 h-4 w-4 shrink-0" />
        <span className="truncate">Visão Geral</span>
      </Link>
      <Link href="/dashboard/servers" className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
        <Server className="mr-3 h-4 w-4 shrink-0" />
        <span className="truncate">Servidores</span>
      </Link>
      <Link href="/dashboard/alerts" className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
        <AlertTriangle className="mr-3 h-4 w-4 shrink-0" />
        <span className="truncate">Alertas</span>
      </Link>
      <Link href="/dashboard/settings" className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
        <Settings className="mr-3 h-4 w-4 shrink-0" />
        <span className="truncate">Configurações</span>
      </Link>
      <button 
        onClick={logout}
        className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors text-red-500 mt-4"
      >
        <LogOut className="mr-3 h-4 w-4 shrink-0" />
        <span className="truncate">Sair</span>
      </button>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-8xl mx-auto">
            <div className="flex items-center gap-4 md:gap-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex items-center gap-2 font-bold text-lg p-6 border-b">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>ObservCore</span>
                  </div>
                  <nav className="p-4">
                    {navigationItems}
                  </nav>
                </SheetContent>
              </Sheet>
              
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg md:text-xl">
                <Activity className="h-6 w-6 text-primary hidden md:block" />
                <span>ObservCore Panel</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                {user && <span>{user.name}</span>}
              </div>
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] md:gap-8 px-4 md:px-6 max-w-8xl mx-auto py-8">
          <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block border-r pr-6">
            <nav className="grid items-start gap-2">
              {navigationItems}
            </nav>
          </aside>
          <main className="flex w-full flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}