"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['end_user', 'company_user', 'superadmin']),
})

// Define the form data type
type SignupFormData = z.infer<typeof schema>;

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: data.role,
        },
      },
    })
    setLoading(false)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Signed up successfully. Please check your email for verification.",
      })
      // Redirect to login page or appropriate next step
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
        </div>
        <div className="mb-6">
          <select
            {...register("role")}
            className={`w-full p-2 border rounded ${errors.role ? "border-red-500" : ""}`}
          >
            <option value="end_user">End User</option>
            <option value="company_user">Company User</option>
            <option value="superadmin">Super Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs italic">{errors.role.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </Button>
      </form>
    </div>
  )
}
