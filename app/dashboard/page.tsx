"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, Server, AlertCircle, CheckCircle, Zap, ShieldAlert } from 'lucide-react'
import { api } from '@/lib/api'

interface Alert {
  id: string
  message: string
  severity: string
  isResolved: boolean
  createdAt: string
  metricId?: string
  value?: number
  zScoreValue?: number
}

interface Service {
  id: string
  name: string
  status: string
  url: string
}

interface Metric {
  id: string
  name: string
  value: number
  timestamp: string
  serviceId?: string
}

interface Config {
  id: string
  name: string
  url: string
}

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 3000)
   
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    
    try {
      const [alertsRes, servicesRes, metricsRes, configRes] = await Promise.all([
        api.get('/alerts'),
        api.get('/services'),
        api.get('/metrics'),
        api.get('/prometheus-configs')
      ])

      setAlerts(alertsRes.data)
      setServices(servicesRes.data)
      setMetrics(metricsRes.data)
      setConfig(configRes.data)
      
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await api.patch(`/alerts/${alertId}`, { isResolved: true })
      loadDashboardData()
    } catch (error) {
      console.error(error)
    }
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-500/10 text-red-600 border-red-200',
      'HIGH': 'bg-orange-500/10 text-orange-600 border-orange-200',
      'MEDIUM': 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
      'LOW': 'bg-blue-500/10 text-blue-600 border-blue-200'
    }
    return colors[severity] || 'bg-gray-500/10 text-gray-600'
  }

  const activeAlerts = alerts.filter(a => !a.isResolved)
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL').length
  const highAlerts = activeAlerts.filter(a => a.severity === 'HIGH').length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Activity className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dados do monitoramento...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoramento</h1>
          <p className="text-muted-foreground">
            Visão geral do status do sistema e anomalias detectadas.
          </p>
        </div>
        {config && (
          <Badge variant="outline" className="px-4 py-1.5 text-sm h-fit">
            <Server className="h-3 w-3 mr-2" />
            {config.name}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{services.length}</div>
            <CardDescription className="mt-2">
              Monitorados ativamente
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Métricas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.length}</div>
            <CardDescription className="mt-2">
              Queries PromQL ativas
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{activeAlerts.length}</div>
            <CardDescription className="mt-2">
              {highAlerts} com alta prioridade
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalAlerts}</div>
            <CardDescription className="mt-2">
              Requerem atenção imediata
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 h-fit">
          <CardHeader>
            <CardTitle>Status dos Serviços</CardTitle>
            <CardDescription>
              Saúde e métricas coletadas por serviço configurado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <Server className="h-10 w-10 mb-3 opacity-20" />
                <p>Nenhum serviço configurado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => {
                  const serviceMetrics = metrics.filter(m => m.serviceId === service.id)
                  const serviceAlerts = activeAlerts.filter(a => 
                    serviceMetrics.some(m => m.id === a.metricId)
                  )
                  
                  return (
                    <div key={service.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base">{service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {serviceMetrics.length} métricas • {service.url}
                          </p>
                        </div>
                      </div>
                      <div className="pl-4">
                        {serviceAlerts.length > 0 ? (
                          <Badge variant="destructive" className="rounded-full px-3">
                            {serviceAlerts.length} anomalias
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Saudável
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 h-fit">
          <CardHeader>
            <CardTitle>Alertas Recentes</CardTitle>
            <CardDescription>
              Feed de anomalias em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <CheckCircle className="h-10 w-10 mb-3 text-green-500 opacity-50" />
                <p>Nenhum alerta ativo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlerts.slice(0, 5).map((alert) => {
                  const metric = metrics.find(m => m.id === alert.metricId)
                  const service = metric ? services.find(s => s.id === metric.serviceId) : null
                  
                  return (
                    <div key={alert.id} className="group relative flex flex-col gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
                          <div className="space-y-1">
                            <p className="text-sm font-semibold leading-none">
                              {metric?.name || 'Métrica desconhecida'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {service?.name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getSeverityColor(alert.severity)} border-0`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 pl-5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Valor:</span> {alert?.value?.toFixed(2) ?? 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Z-Score:</span> {alert?.zScoreValue?.toFixed(2) ?? 'N/A'}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => resolveAlert(alert.id)}
                        className="w-full mt-2 h-8 text-xs"
                      >
                        Marcar como Resolvido
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!config && (
        <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-900/50 dark:bg-orange-950/20">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-200">Configuração Pendente</h3>
              <p className="text-sm text-orange-800/80 dark:text-orange-300/80">
                Configure a URL do servidor Prometheus para iniciar o monitoramento.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}