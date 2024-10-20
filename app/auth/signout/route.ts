import { BASE_URL_DEFAULT } from '@/app/constants'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? BASE_URL_DEFAULT

  revalidatePath('/', 'layout')
  return NextResponse.redirect(`${baseUrl}/login`, {
    status: 302,
  })
}