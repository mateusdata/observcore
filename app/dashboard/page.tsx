"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface Alert {
  id: string;
  message: string;
  severity: string;
  isResolved: boolean;
  createdAt: string;
  metricId?: string;
  value?: number;
  zScoreValue?: number;
}

interface Service {
  id: string;
  name: string;
  status: string;
  url: string;
}

interface Metric {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  serviceId?: string;
}

interface Config {
  id: string;
  name: string;
  url: string;
}

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [alertsRes, servicesRes, metricsRes, configRes] = await Promise.all([
        api.get('/alerts'),
        api.get('/services'),
        api.get('/metrics'),
        api.get('/prometheus-configs')
      ]);

      setAlerts(alertsRes.data);
      setServices(servicesRes.data);
      setMetrics(metricsRes.data);
      setConfig(configRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await api.patch(`/alerts/${alertId}`, { isResolved: true });
      loadDashboardData();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-500 text-white',
      'HIGH': 'bg-orange-500 text-white',
      'MEDIUM': 'bg-yellow-500 text-white',
      'LOW': 'bg-blue-500 text-white'
    };
    return colors[severity] || 'bg-gray-500 text-white';
  };

  const activeAlerts = alerts.filter(a => !a.isResolved);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlerts = activeAlerts.filter(a => a.severity === 'HIGH').length;

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <Activity className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Monitoramento</h2>
        {config && (
          <Badge variant="outline" className="hidden sm:flex">
            {config.name}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Serviços Configurados
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de serviços monitorados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Métricas Ativas
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
            <p className="text-xs text-muted-foreground">
              Queries PromQL configuradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Ativos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {highAlerts} alta prioridade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Críticos
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção imediata
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Serviços Monitorados</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center rounded border border-dashed bg-muted/50 text-muted-foreground">
                Nenhum serviço configurado
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => {
                  const serviceMetrics = metrics.filter(m => m.serviceId === service.id);
                  const serviceAlerts = activeAlerts.filter(a => 
                    serviceMetrics.some(m => m.id === a.metricId)
                  );
                  
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{service.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {serviceMetrics.length} métricas configuradas
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {serviceAlerts.length > 0 ? (
                          <Badge variant="destructive" className="shrink-0">
                            {serviceAlerts.length} alertas
                          </Badge>
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {activeAlerts.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
                <p>Nenhum alerta ativo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlerts.slice(0, 5).map((alert) => {
                  const metric = metrics.find(m => m.id === alert.metricId);
                  const service = metric ? services.find(s => s.id === metric.serviceId) : null;
                  
                  return (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${getSeverityColor(alert.severity)}`}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium leading-none truncate">
                          {metric?.name || 'Métrica desconhecida'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {service?.name || 'Serviço desconhecido'}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs">
                            Valor: {alert?.value?.toFixed(2) ?? 'N/A'}
                          </span>
                          <span className="text-xs">
                            Z-Score: {alert?.zScoreValue?.toFixed(2) ?? 'N/A'}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resolveAlert(alert.id)}
                        className="shrink-0"
                      >
                        Resolver
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!config && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertCircle className="h-5 w-5" />
              Configuração Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure sua URL do Prometheus para começar a monitorar seus serviços.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}