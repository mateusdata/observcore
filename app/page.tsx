import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Server, ShieldAlert, Zap, BarChart3, AlertCircle, CheckCircle, TrendingUp } from "lucide-react"
import { ModeToggle } from "@/components/ui/mode-toggle"
import HeaderPuclic from "@/components/header-public"
import MainCardPublic from "@/components/main-card-public"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">

      <HeaderPuclic />
      <MainCardPublic />
      <Footer />

    </div>
  )
}