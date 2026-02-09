"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PrometheusConfigForm } from "@/components/forms/prometheus-config-form"
import { api } from "@/lib/api"
import { Server, Loader2, CheckCircle } from "lucide-react"

interface PrometheusConfig {
    id: string
    name: string
    url: string
}

export default function SettingsPage() {
    const [config, setConfig] = useState<PrometheusConfig | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadConfig()
    }, [])

    const loadConfig = async () => {
        try {
            const res = await api.get("/prometheus-configs")
            setConfig(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: { name: string; url: string }) => {
        try {
            if (config) {
                await api.patch("/prometheus-configs", data)
            } else {
                await api.post("/prometheus-configs", data)
            }
            await loadConfig()
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando configuracoes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configuracoes</h1>
                <p className="text-muted-foreground">
                    Configure a instancia Prometheus para coleta de metricas
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                <Server className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Instancia Prometheus</CardTitle>
                                <CardDescription>
                                    Servidor para coleta de metricas
                                </CardDescription>
                            </div>
                        </div>
                        {config && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Configurado
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <PrometheusConfigForm
                        defaultValues={
                            config
                                ? { name: config.name, url: config.url }
                                : undefined
                        }
                        onSubmit={handleSubmit}
                        isEditing={!!config}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
