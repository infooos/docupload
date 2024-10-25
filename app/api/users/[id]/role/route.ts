import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ role: data?.role || 'end_user' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    )
  }
}