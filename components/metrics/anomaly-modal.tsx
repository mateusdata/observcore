"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Activity, AlertTriangle } from "lucide-react"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts"
import { api } from "@/lib/api"

interface Metric {
    id: string
    name: string
    promQL: string
    zScoreThreshold: number
    checkInterval: number
    serviceId: string
}

interface Alert {
    id: string
    metricId: string
    value: number
    zScoreValue: number
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    isResolved: boolean
    timestamp: string
}

interface AnomalyModalProps {
    metric: Metric | null
    open: boolean
    onClose: () => void
}

export function AnomalyModal({ metric, open, onClose }: AnomalyModalProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (metric && open) {
            fetchData()
        }
    }, [metric, open])

    const fetchData = async () => {
        if (!metric) return

        setLoading(true)
        setError(null)
        setData([])

        try {
            const response = await api.get("/alerts")
            const alerts = response.data || []

            const filteredAlerts = alerts
                .filter((alert: Alert) => alert.metricId === metric.id)
                .map((alert: Alert) => ({
                    time: new Date(alert.timestamp).getTime(),
                    value: alert.value,
                    zscore: alert.zScoreValue,
                    severity: alert.severity,
                    isResolved: alert.isResolved,
                }))
                .sort((a: any, b: any) => a.time - b.time)

            setData(filteredAlerts)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Ocorreu um erro desconhecido.")
        } finally {
            setLoading(false)
        }
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            const timeStr = format(new Date(data.time), "dd/MM HH:mm:ss")
            const value = data.value?.toFixed(2)

            return (
                <div className="bg-background border rounded shadow p-3 text-sm z-50">
                    <p className="font-semibold mb-1">{timeStr}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span>Valor: {value}</span>
                    </div>
                    <div className="text-destructive font-medium mt-1">
                        Z-Score: {data.zscore?.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground mt-1">
                        Status: {data.isResolved ? "Resolvido" : "Ativo"}
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Histórico de Anomalias
                            </DialogTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                                Metrica: <span className="font-mono bg-muted px-1 rounded">{metric?.name}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-4 min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[350px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Consultando histórico...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-[350px] text-center px-4">
                            <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
                            <h3 className="text-lg font-medium mb-1">Erro na consulta</h3>
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                            Nenhuma anomalia detectada para esta metrica.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                    <span className="text-sm text-muted-foreground">Total de Ocorrências</span>
                                    <span className="text-2xl font-bold text-destructive">{data.length}</span>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                                    <span className="text-sm text-muted-foreground">Limiar Configurado</span>
                                    <span className="text-2xl font-bold">±{metric?.zScoreThreshold}</span>
                                </div>
                            </div>

                            <div className="h-[300px] w-full border rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                                        <XAxis
                                            type="number"
                                            dataKey="time"
                                            name="tempo"
                                            domain={['dataMin', 'dataMax']}
                                            tickFormatter={(tick) => format(new Date(tick), "dd/MM HH:mm")}
                                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                            stroke="hsl(var(--muted-foreground)/0.3)"
                                        />
                                        <YAxis
                                            dataKey="value"
                                            name="valor"
                                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                            stroke="hsl(var(--muted-foreground)/0.3)"
                                            domain={['auto', 'auto']}
                                        />
                                        <Tooltip content={<CustomTooltip />} />

                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            dot={{ fill: '#ef4444', r: 4 }}
                                            activeDot={{ r: 6 }}
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
