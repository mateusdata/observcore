import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Server, ShieldAlert, Zap, BarChart3, AlertCircle, CheckCircle, TrendingUp } from "lucide-react"

export default function MainCardPublic() {
    return (
        <main className="flex-1">
            <section className="w-full py-12 md:py-16 lg:py-16 xl:py-4 bg-gradient-to-b from-background to-muted/20">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-6 text-center min-h-[400px] md:min-h-[500px]">
                        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs md:text-sm font-semibold">
                            Monitoramento Inteligente com Prometheus
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl">
                            Detecte Anomalias Antes que se Tornem Problemas
                        </h1>
                        <p className="max-w-[700px] text-base md:text-lg lg:text-xl text-muted-foreground px-4">
                            Configure suas métricas, conecte seu Prometheus e receba alertas inteligentes baseados em análise estatística Z-Score para prevenir falhas críticas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0 pt-2">
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full h-11 px-8">
                                    Começar Gratuitamente
                                </Button>
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full h-11 px-8">
                                    Fazer Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-16 lg:py-16">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Como Funciona
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                            Sistema completo de detecção de anomalias em 4 etapas simples
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                    <Server className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg md:text-xl">Configure o Prometheus</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Cadastre a URL do seu servidor Prometheus e valide a conexão com um clique.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg md:text-xl">Organize Serviços</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Crie grupos lógicos para seus sistemas: API, Banco de Dados, Cache, Filas.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg md:text-xl">Defina Métricas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Adicione queries PromQL customizadas e configure thresholds de Z-Score por métrica.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                    <ShieldAlert className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg md:text-xl">Receba Alertas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Job automático analisa métricas a cada minuto e notifica anomalias por severidade.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-16 lg:py-16 bg-muted/30">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Recursos Principais
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                            Tudo que você precisa para monitorar infraestruturas complexas
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                <CardTitle>Análise Z-Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Algoritmo estatístico que detecta desvios padrão em tempo real, eliminando falsos positivos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
                                <CardTitle>Queries PromQL Customizadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Total flexibilidade para monitorar qualquer métrica: CPU, memória, latência, erros HTTP.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <AlertCircle className="h-8 w-8 text-orange-500 mb-2" />
                                <CardTitle>Severidade Automática</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Alertas classificados em LOW, MEDIUM, HIGH e CRITICAL baseado no Z-Score calculado.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Server className="h-8 w-8 text-purple-500 mb-2" />
                                <CardTitle>Múltiplos Serviços</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Organize métricas em grupos lógicos e visualize o status de cada serviço separadamente.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-8 w-8 text-cyan-500 mb-2" />
                                <CardTitle>Dashboard em Tempo Real</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Interface moderna que atualiza automaticamente mostrando alertas ativos e histórico.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                                <CardTitle>Job Automatizado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Execução em background a cada minuto sem intervenção manual para coleta e análise.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-16 lg:py-16">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                            Pronto para Começar?
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground">
                            Configure seu primeiro serviço de monitoramento em menos de 5 minutos.
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 text-base">
                                Criar Conta Gratuita
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
