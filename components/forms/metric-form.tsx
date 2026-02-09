"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const metricSchema = z.object({
    name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
    query: z.string().min(1, "Query PromQL e obrigatoria"),
    zScoreThreshold: z.coerce
        .number()
        .min(1, "Minimo 1")
        .max(5, "Maximo 5"),
    checkInterval: z.coerce
        .number()
        .min(10, "Intervalo minimo de 10 segundos"),
    serviceId: z.string().min(1, "Selecione um servico"),
})

type MetricFormValues = z.infer<typeof metricSchema>

interface Service {
    id: string
    name: string
}

interface MetricFormProps {
    defaultValues?: MetricFormValues
    services: Service[]
    onSubmit: (data: MetricFormValues) => Promise<void>
    onCancel: () => void
    isEditing?: boolean
}

export function MetricForm({
    defaultValues,
    services,
    onSubmit,
    onCancel,
    isEditing = false,
}: MetricFormProps) {
    const form = useForm<MetricFormValues>({
        resolver: zodResolver(metricSchema),
        defaultValues: defaultValues || {
            name: "",
            query: "",
            zScoreThreshold: 2,
            checkInterval: 60,
            serviceId: "",
        },
        mode: "onChange",
    })

    const handleSubmit = async (data: MetricFormValues) => {
        await onSubmit(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome da Metrica</FormLabel>
                            <FormControl>
                                <Input placeholder="CPU Usage" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Query PromQL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="rate(http_requests_total[5m])"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="zScoreThreshold"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Z-Score Threshold</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormDescription>Entre 1 e 5</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="checkInterval"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Intervalo (segundos)</FormLabel>
                                <FormControl>
                                    <Input type="number" min={10} {...field} />
                                </FormControl>
                                <FormDescription>Minimo 10s</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Servico</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um servico" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {services.map((service) => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                        className="flex-1"
                    >
                        {form.formState.isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditing ? "Atualizar" : "Criar Metrica"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
