"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { ServiceForm } from "@/components/forms/service-form"
import { api } from "@/lib/api"
import { Plus, Pencil, Trash2, Loader2, Server } from "lucide-react"

interface PrometheusConfig {
    id: string
    name: string
    url: string
}

interface Service {
    id: string
    name: string
    description?: string
    prometheusConfigId: string
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [prometheusConfig, setPrometheusConfig] = useState<PrometheusConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [servicesRes, configRes] = await Promise.all([
                api.get("/services"),
                api.get("/prometheus-configs").catch(() => ({ data: null })),
            ])
            setServices(servicesRes.data || [])
            setPrometheusConfig(configRes.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: {
        name: string
        description?: string
        prometheusConfigId: string
    }) => {
        try {
            if (editingService) {
                await api.patch(`/services/${editingService.id}`, data)
            } else {
                await api.post("/services", data)
            }
            setDialogOpen(false)
            setEditingService(null)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/services/${id}`)
            await loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (service: Service) => {
        setEditingService(service)
        setDialogOpen(true)
    }

    const openCreate = () => {
        setEditingService(null)
        setDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando servicos...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Servicos</h1>
                    <p className="text-muted-foreground">
                        Gerencie os servicos monitorados pelo Prometheus
                    </p>
                </div>
                <Button onClick={openCreate} disabled={!prometheusConfig}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Servico
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {!prometheusConfig ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Server className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Configure o Prometheus primeiro</p>
                            <p className="text-sm">Acesse Configuracoes para definir a instancia Prometheus</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Server className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Nenhum servico cadastrado</p>
                            <p className="text-sm">Clique em "Novo Servico" para adicionar</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Descricao</TableHead>
                                    <TableHead className="w-[100px]">Acoes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">{service.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {service.description || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(service)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(service.id)}
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
                                    description: editingService.description || "",
                                    prometheusConfigId: editingService.prometheusConfigId,
                                }
                                : undefined
                        }
                        prometheusConfigs={prometheusConfig ? [prometheusConfig] : []}
                        onSubmit={handleSubmit}
                        onCancel={() => setDialogOpen(false)}
                        isEditing={!!editingService}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
