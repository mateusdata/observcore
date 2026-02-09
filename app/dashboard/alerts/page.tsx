"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"
import { Loader2, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface Alert {
    id: string
    value: number
    zScoreValue: number
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    isResolved: boolean
    createdAt: string
    metricId: string
}

interface Metric {
    id: string
    name: string
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [metrics, setMetrics] = useState<Metric[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>("all")

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 5000)
        return () => clearInterval(interval)
    }, [])

    const loadData = async () => {
        try {
            const [alertsRes, metricsRes] = await Promise.all([
                api.get("/alerts"),
                api.get("/metrics"),
            ])
            setAlerts(alertsRes.data || [])
            setMetrics(metricsRes.data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const resolveAlert = async (id: string) => {
        try {
            await api.patch(`/alerts/${id}`, { isResolved: true })
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const getMetricName = (metricId: string) => {
        const metric = metrics.find((m) => m.id === metricId)
        return metric?.name || "-"
    }

    const getSeverityBadge = (severity: string) => {
        const styles: Record<string, string> = {
            CRITICAL: "bg-red-500/10 text-red-600 border-red-200",
            HIGH: "bg-orange-500/10 text-orange-600 border-orange-200",
            MEDIUM: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
            LOW: "bg-blue-500/10 text-blue-600 border-blue-200",
        }
        return styles[severity] || "bg-gray-500/10 text-gray-600"
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const filteredAlerts = alerts.filter((alert) => {
        if (filter === "all") return true
        if (filter === "active") return !alert.isResolved
        if (filter === "resolved") return alert.isResolved
        return alert.severity === filter
    })

    const activeCount = alerts.filter((a) => !a.isResolved).length
    const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && !a.isResolved).length

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando alertas...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Alertas</h1>
                    <p className="text-muted-foreground">
                        {activeCount} alertas ativos{criticalCount > 0 && `, ${criticalCount} criticos`}
                    </p>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="resolved">Resolvidos</SelectItem>
                        <SelectItem value="CRITICAL">Criticos</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="MEDIUM">Media</SelectItem>
                        <SelectItem value="LOW">Baixa</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-0">
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Nenhum alerta registrado</p>
                            <p className="text-sm">O sistema esta funcionando normalmente</p>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <AlertTriangle className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Nenhum alerta encontrado</p>
                            <p className="text-sm">Tente ajustar o filtro</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metrica</TableHead>
                                    <TableHead>Severidade</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Z-Score</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Acao</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAlerts.map((alert) => (
                                    <TableRow key={alert.id} className={alert.isResolved ? "opacity-60" : ""}>
                                        <TableCell className="font-medium">
                                            {getMetricName(alert.metricId)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getSeverityBadge(alert.severity)}>
                                                {alert.severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{alert.value.toFixed(2)}</TableCell>
                                        <TableCell>{alert.zScoreValue.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(alert.createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {alert.isResolved ? (
                                                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                                                    Resolvido
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                                                    Ativo
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {!alert.isResolved && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => resolveAlert(alert.id)}
                                                >
                                                    Resolver
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
