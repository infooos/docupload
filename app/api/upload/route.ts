import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const userId = formData.get('userId') as string
  const companyId = formData.get('companyId') as string

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${companyId}/${fileName}`, file)

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

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: uploadData })
}