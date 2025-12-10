"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

const verifyCodeSchema = z.object({
  code: z.string().min(6, "Código deve ter 6 dígitos").max(6, "Código deve ter 6 dígitos"),
})

type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>

export default function VerifyCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (values: VerifyCodeFormValues) => {
    setLoading(true)
    setError("")
    try {
      const response = await api.post("/auth/validate-code", {
        email,
        code: values.code
      }, {
        validateStatus: () => true
      })
      
      if (response.status === 200 || response.status === 201) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${values.code}`)
      } else {
        setError(response.data?.message || "Código inválido. Tente novamente.")
      }
    } catch (err: any) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setLoading(true)
    setError("")
    
    try {
      const response = await api.post("/auth/send-code", { email }, {
        validateStatus: () => true
      })
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message)
      }
      form.reset()
    } catch (err: any) {
      setError(err.message || "Erro ao reenviar código.")
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Activity className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Verificar Código</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para {email}
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Verificação</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        type="text"
                        maxLength={6}
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
                {loading ? "Verificando..." : "Verificar Código"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={resendCode}
                disabled={loading}
              >
                Reenviar Código
              </Button>
              <div className="text-center text-sm">
                <Link href="/login" className="underline">
                  Voltar para o login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}