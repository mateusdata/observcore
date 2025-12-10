"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { api } from "@/lib/api"

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true)
    setError("")
    
    try {
      const response = await api.post("/auth/send-code", { email: values.email }, {
        validateStatus: () => true
      })
      
      if (response.status === 200 || response.status === 201) {
        router.push(`/verify-code?email=${encodeURIComponent(values.email)}`)
      } else {
        setError(response.data?.message || "Erro ao enviar código. Tente novamente.")
      }
    } catch (err: any) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Activity className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Esqueci a Senha</CardTitle>
          <CardDescription>
            Digite seu e-mail para receber o código de recuperação
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm rounded-md bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border">
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Código"}
              </Button>
              <div className="text-center text-sm">
                Lembrou a senha?{" "}
                <Link href="/login" className="underline">
                  Fazer login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}