import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  // Extract form data from the request
  const formData = await req.formData()
  const file = formData.get('file') as File
  const userId = formData.get('userId') as string
  const companyId = formData.get('companyId') as string

  // Check if a file was uploaded
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Generate a unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${companyId}/${fileName}`, file)

  // Handle upload errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Save file metadata to the database
  const { data: uploadData, error: uploadError } = await supabase
    .from('uploads')
    .insert({
      user_id: userId,
      company_id: companyId,
      original_file_name: file.name,
      saved_as_name: fileName,
      upload_date: new Date().toISOString(),
    })

  // Handle database insertion errors
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Return success response with upload data
  return NextResponse.json({ success: true, data: uploadData })
}
