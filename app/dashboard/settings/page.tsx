"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { PrometheusConfigForm } from "@/components/forms/prometheus-config-form"
import { ServiceForm } from "@/components/forms/service-form"
import { MetricForm } from "@/components/forms/metric-form"
import { api } from "@/lib/api"
import {
    Server,
    Plus,
    Pencil,
    Trash2,
    Activity,
    Zap,
    Loader2,
    CheckCircle,
} from "lucide-react"

interface PrometheusConfig {
    id: string
    name: string
    url: string
}

interface Service {
    id: string
    name: string
    url: string
    prometheusConfigId: string
}

interface Metric {
    id: string
    name: string
    query: string
    zScoreThreshold: number
    checkInterval: number
    serviceId: string
}

export default function SettingsPage() {
    const [prometheusConfig, setPrometheusConfig] = useState<PrometheusConfig | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [metrics, setMetrics] = useState<Metric[]>([])
    const [loading, setLoading] = useState(true)

    const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
    const [metricDialogOpen, setMetricDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [editingMetric, setEditingMetric] = useState<Metric | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [configRes, servicesRes, metricsRes] = await Promise.all([
                api.get("/prometheus-configs"),
                api.get("/services"),
                api.get("/metrics"),
            ])
            setPrometheusConfig(configRes.data)
            setServices(servicesRes.data)
            setMetrics(metricsRes.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePrometheusSubmit = async (data: { name: string; url: string }) => {
        try {
            if (prometheusConfig) {
                await api.patch(`/prometheus-configs/${prometheusConfig.id}`, data)
            } else {
                await api.post("/prometheus-configs", data)
            }
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleServiceSubmit = async (data: {
        name: string
        url?: string
        prometheusConfigId: string
    }) => {
        try {
            if (editingService) {
                await api.patch(`/services/${editingService.id}`, data)
            } else {
                await api.post("/services", data)
            }
            setServiceDialogOpen(false)
            setEditingService(null)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleMetricSubmit = async (data: {
        name: string
        query: string
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
            setMetricDialogOpen(false)
            setEditingMetric(null)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteService = async (id: string) => {
        try {
            await api.delete(`/services/${id}`)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteMetric = async (id: string) => {
        try {
            await api.delete(`/metrics/${id}`)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const openEditService = (service: Service) => {
        setEditingService(service)
        setServiceDialogOpen(true)
    }

    const openEditMetric = (metric: Metric) => {
        setEditingMetric(metric)
        setMetricDialogOpen(true)
    }

    const getServiceName = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId)
        return service?.name || "N/A"
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando configuracoes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuracoes</h1>
                <p className="text-muted-foreground">
                    Gerencie instancias Prometheus, servicos e metricas de monitoramento.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                            <Server className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Instancia Prometheus</CardTitle>
                            <CardDescription>
                                Configure o servidor Prometheus para coleta de metricas
                            </CardDescription>
                        </div>
                        {prometheusConfig && (
                            <Badge variant="secondary" className="ml-auto bg-green-500/10 text-green-600 border-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Configurado
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <PrometheusConfigForm
                        defaultValues={
                            prometheusConfig
                                ? { name: prometheusConfig.name, url: prometheusConfig.url }
                                : undefined
                        }
                        onSubmit={handlePrometheusSubmit}
                        isEditing={!!prometheusConfig}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                <Activity className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Servicos</CardTitle>
                                <CardDescription>
                                    Servicos monitorados vinculados a instancia Prometheus
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingService(null)
                                setServiceDialogOpen(true)
                            }}
                            disabled={!prometheusConfig}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Servico
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!prometheusConfig ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Server className="h-10 w-10 mb-3 opacity-20" />
                            <p>Configure a instancia Prometheus primeiro</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Activity className="h-10 w-10 mb-3 opacity-20" />
                            <p>Nenhum servico cadastrado</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead className="w-[100px]">Acoes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">{service.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {service.url || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => openEditService(service)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleDeleteService(service.id)}
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

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Metricas</CardTitle>
                                <CardDescription>
                                    Queries PromQL monitoradas para deteccao de anomalias
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingMetric(null)
                                setMetricDialogOpen(true)
                            }}
                            disabled={services.length === 0}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Metrica
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Activity className="h-10 w-10 mb-3 opacity-20" />
                            <p>Cadastre um servico primeiro</p>
                        </div>
                    ) : metrics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Zap className="h-10 w-10 mb-3 opacity-20" />
                            <p>Nenhuma metrica cadastrada</p>
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
                                        <TableCell className="font-medium">{metric.name}</TableCell>
                                        <TableCell>{getServiceName(metric.serviceId)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{metric.zScoreThreshold}</Badge>
                                        </TableCell>
                                        <TableCell>{metric.checkInterval}s</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => openEditMetric(metric)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleDeleteMetric(metric.id)}
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

            <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingService ? "Editar Servico" : "Novo Servico"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingService
                                ? "Atualize as informacoes do servico"
                                : "Cadastre um novo servico para monitoramento"}
                        </DialogDescription>
                    </DialogHeader>
                    <ServiceForm
                        defaultValues={
                            editingService
                                ? {
                                    name: editingService.name,
                                    url: editingService.url,
                                    prometheusConfigId: editingService.prometheusConfigId,
                                }
                                : undefined
                        }
                        prometheusConfigs={prometheusConfig ? [prometheusConfig] : []}
                        onSubmit={handleServiceSubmit}
                        onCancel={() => setServiceDialogOpen(false)}
                        isEditing={!!editingService}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={metricDialogOpen} onOpenChange={setMetricDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMetric ? "Editar Metrica" : "Nova Metrica"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMetric
                                ? "Atualize as informacoes da metrica"
                                : "Cadastre uma nova metrica para monitoramento"}
                        </DialogDescription>
                    </DialogHeader>
                    <MetricForm
                        defaultValues={
                            editingMetric
                                ? {
                                    name: editingMetric.name,
                                    query: editingMetric.query,
                                    zScoreThreshold: editingMetric.zScoreThreshold,
                                    checkInterval: editingMetric.checkInterval,
                                    serviceId: editingMetric.serviceId,
                                }
                                : undefined
                        }
                        services={services}
                        onSubmit={handleMetricSubmit}
                        onCancel={() => setMetricDialogOpen(false)}
                        isEditing={!!editingMetric}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
