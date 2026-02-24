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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { MetricForm } from "@/components/forms/metric-form"
import { AnomalyModal } from "@/components/metrics/anomaly-modal"
import { api } from "@/lib/api"
import { Plus, Pencil, Trash2, Loader2, Zap, Server, Activity } from "lucide-react"

interface Service {
    id: string
    name: string
}

interface Metric {
    id: string
    name: string
    promQL: string
    zScoreThreshold: number
    checkInterval: number
    serviceId: string
}

export default function MetricsPage() {
    const [metrics, setMetrics] = useState<Metric[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingMetric, setEditingMetric] = useState<Metric | null>(null)
    const [anomalyModalOpen, setAnomalyModalOpen] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [metricsRes, servicesRes] = await Promise.all([
                api.get("/metrics"),
                api.get("/services"),
            ])
            setMetrics(metricsRes.data || [])
            setServices(servicesRes.data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: {
        name: string
        promQL: string
        zScoreThreshold: number
        checkInterval: number
        serviceId: string
    }) => {
        try {
            if (editingMetric) {
                await api.patch(`/metrics/${editingMetric.id}`, data)
            } else {
                await api.post("/metrics", data)
            }
            setDialogOpen(false)
            setEditingMetric(null)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/metrics/${id}`)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (metric: Metric) => {
        setEditingMetric(metric)
        setDialogOpen(true)
    }

    const openCreate = () => {
        setEditingMetric(null)
        setDialogOpen(true)
    }

    const openAnomalyModal = (metric: Metric) => {
        setSelectedMetric(metric)
        setAnomalyModalOpen(true)
    }

    const getServiceName = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId)
        return service?.name || "-"
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando metricas...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Metricas</h1>
                    <p className="text-muted-foreground">
                        Queries PromQL para deteccao de anomalias
                    </p>
                </div>
                <Button onClick={openCreate} disabled={services.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Metrica
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Server className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Cadastre um servico primeiro</p>
                            <p className="text-sm">Metricas precisam estar vinculadas a um servico</p>
                        </div>
                    ) : metrics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Zap className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Nenhuma metrica cadastrada</p>
                            <p className="text-sm">Clique em "Nova Metrica" para adicionar</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Servico</TableHead>
                                    <TableHead>Z-Score</TableHead>
                                    <TableHead>Intervalo</TableHead>
                                    <TableHead className="w-[100px]">Acoes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {metrics.map((metric) => (
                                    <TableRow key={metric.id}>
                                        <TableCell>
                                            <button
                                                onClick={() => openAnomalyModal(metric)}
                                                className="font-medium hover:underline text-primary flex items-center gap-1.5 transition-colors focus:outline-none"
                                                title="Ver deteccao de anomalias com Z-Score"
                                            >
                                                <Activity className="h-3.5 w-3.5" />
                                                {metric.name}
                                            </button>
                                        </TableCell>
                                        <TableCell>{getServiceName(metric.serviceId)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{metric.zScoreThreshold}</Badge>
                                        </TableCell>
                                        <TableCell>{metric.checkInterval}s</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(metric)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(metric.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMetric ? "Editar Metrica" : "Nova Metrica"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMetric
                                ? "Atualize as informacoes da metrica"
                                : "Cadastre uma nova query PromQL"}
                        </DialogDescription>
                    </DialogHeader>
                    <MetricForm
                        defaultValues={
                            editingMetric
                                ? {
                                    name: editingMetric.name,
                                    promQL: editingMetric.promQL,
                                    zScoreThreshold: editingMetric.zScoreThreshold,
                                    checkInterval: editingMetric.checkInterval,
                                    serviceId: editingMetric.serviceId,
                                }
                                : undefined
                        }
                        services={services}
                        onSubmit={handleSubmit}
                        onCancel={() => setDialogOpen(false)}
                        isEditing={!!editingMetric}
                    />
                </DialogContent>
            </Dialog>

            <AnomalyModal
                metric={selectedMetric}
                open={anomalyModalOpen}
                onClose={() => setAnomalyModalOpen(false)}
            />
        </div>
    )
}
