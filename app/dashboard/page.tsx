"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Server, AlertCircle, Zap, ShieldAlert, Loader2, ArrowRight, Clock, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"

interface Alert {
  id: string
  severity: string
  isResolved: boolean
  createdAt: string
  metricId: string
}

interface Metric {
  id: string
  name: string
}

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [servicesCount, setServicesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [alertsRes, servicesRes, metricsRes] = await Promise.all([
        api.get("/alerts"),
        api.get("/services"),
        api.get("/metrics"),
      ])
      setAlerts(alertsRes.data || [])
      setServicesCount(servicesRes.data?.length || 0)
      setMetrics(metricsRes.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const activeAlerts = alerts.filter((a) => !a.isResolved)
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "CRITICAL")
  const highAlerts = activeAlerts.filter((a) => a.severity === "HIGH")

  const getMetricName = (metricId: string) => {
    return metrics.find((m) => m.id === metricId)?.name || "-"
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "bg-red-500/10 text-red-600 border-red-200",
      HIGH: "bg-orange-500/10 text-orange-600 border-orange-200",
      MEDIUM: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      LOW: "bg-blue-500/10 text-blue-600 border-blue-200",
    }
    return colors[severity] || "bg-gray-500/10 text-gray-600"
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visao Geral</h1>
        <p className="text-muted-foreground">
          Status do sistema e anomalias detectadas
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{servicesCount}</p>
              <p className="text-xs text-muted-foreground">Servicos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.length}</p>
              <p className="text-xs text-muted-foreground">Metricas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{activeAlerts.length}</p>
              <p className="text-xs text-muted-foreground">Alertas Ativos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              <p className="text-xs text-muted-foreground">Criticos</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Alertas Recentes</h2>
          <Link href="/dashboard/alerts">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <CardContent className="p-0">
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-3 opacity-20" />
              <p className="font-medium">Sistema operando normalmente</p>
              <p className="text-sm">Nenhum alerta ativo</p>
            </div>
          ) : (
            <div className="divide-y">
              {activeAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{getMetricName(alert.metricId)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(alert.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}