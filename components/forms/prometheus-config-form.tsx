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
import { Loader2 } from "lucide-react"

const prometheusConfigSchema = z.object({
    name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
    url: z.string().url("URL invalida. Use formato http:// ou https://"),
})

type PrometheusConfigFormValues = z.infer<typeof prometheusConfigSchema>

interface PrometheusConfigFormProps {
    defaultValues?: PrometheusConfigFormValues
    onSubmit: (data: PrometheusConfigFormValues) => Promise<void>
    isEditing?: boolean
}

export function PrometheusConfigForm({
    defaultValues,
    onSubmit,
    isEditing = false,
}: PrometheusConfigFormProps) {
    const form = useForm<PrometheusConfigFormValues, unknown, PrometheusConfigFormValues>({
        resolver: zodResolver(prometheusConfigSchema),
        defaultValues: defaultValues || {
            name: "",
            url: "",
        },
        mode: "onChange",
    })

    const handleSubmit = async (data: PrometheusConfigFormValues) => {
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
                            <FormLabel>Nome da Instancia</FormLabel>
                            <FormControl>
                                <Input placeholder="Prometheus Principal" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL do Servidor</FormLabel>
                            <FormControl>
                                <Input placeholder="http://prometheus:9090" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                    className="w-full"
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEditing ? "Atualizar Configuracao" : "Salvar Configuracao"}
                </Button>
            </form>
        </Form>
    )
}
