"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from 'lucide-react'

const schema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      "Only .pdf, .jpg and .png formats are supported."
    ),
})

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('userId', session.user.id)
    formData.append('companyId', '1') // Replace with actual company ID

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
      
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-2">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Upload className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">Upload File</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              type="file"
              accept=".pdf,.jpg,.png"
              {...register("file")}
              className={`w-full ${errors.file ? "border-red-500" : ""}`}
            />
            {errors.file && (
              <p className="mt-1 text-sm text-red-500">{errors.file.message as string}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}