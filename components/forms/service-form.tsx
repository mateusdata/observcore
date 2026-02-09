"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
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

const serviceSchema = z.object({
    name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
    description: z.string().optional(),
    prometheusConfigId: z.string().min(1, "Selecione uma instancia Prometheus"),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface PrometheusConfig {
    id: string
    name: string
}

interface ServiceFormProps {
    defaultValues?: ServiceFormValues
    prometheusConfigs: PrometheusConfig[]
    onSubmit: (data: ServiceFormValues) => Promise<void>
    onCancel: () => void
    isEditing?: boolean
}

export function ServiceForm({
    defaultValues,
    prometheusConfigs,
    onSubmit,
    onCancel,
    isEditing = false,
}: ServiceFormProps) {
    const form = useForm<ServiceFormValues, unknown, ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: defaultValues || {
            name: "",
            description: "",
            prometheusConfigId: "",
        },
        mode: "onChange",
    })

    const handleSubmit = async (data: ServiceFormValues) => {
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
                            <FormLabel>Nome do Servico</FormLabel>
                            <FormControl>
                                <Input placeholder="API Gateway" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descricao (opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Servico de gateway da API" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="prometheusConfigId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instancia Prometheus</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma instancia" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {prometheusConfigs.map((config) => (
                                        <SelectItem key={config.id} value={config.id}>
                                            {config.name}
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
                        {isEditing ? "Atualizar" : "Criar Servico"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
