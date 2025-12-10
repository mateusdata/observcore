"use client"

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
    <>
      <div className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer bg-accent">
        <BarChart3 className="mr-2 h-4 w-4" />
        Visão Geral
      </div>
      <div className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer">
        <Server className="mr-2 h-4 w-4" />
        Servidores
      </div>
      <div className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer">
        <AlertTriangle className="mr-2 h-4 w-4" />
        Alertas
      </div>
      <div className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer">
        <Settings className="mr-2 h-4 w-4" />
        Configurações
      </div>
      <button 
        onClick={logout}
        className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer text-red-500"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </button>
    </>
  )

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex items-center gap-2 font-bold text-lg p-6 border-b">
                    <Activity className="h-5 w-5" />
                    <span>ObservCore</span>
                  </div>
                  <nav className="grid items-start gap-2 p-4">
                    {navigationItems}
                  </nav>
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-2 font-bold text-lg md:text-xl">
                <Activity className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">ObservCore Panel</span>
                <span className="sm:hidden">ObservCore</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
               
                {user && (
                  <span className="text-muted-foreground">{user.name}</span>
                )}
              </div>
              <ModeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] md:gap-6 md:py-6">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <nav className="grid items-start gap-2 p-4">
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