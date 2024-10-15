'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { AuthApiError } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  const params = new URLSearchParams();
  if (error) {
    const errorString = "Incorrect username or password. Please try again.";
    params.set('error', errorString)
    redirect(`/login?${params.toString()}`)
  }

  revalidatePath('/', 'layout')

  const redirectTo = formData.get('redirectTo') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const usernameInput = formData.get('username') as string
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        username: usernameInput,
      }
    }
  }
  const confirmedPassword = formData.get('confirm-password') as string
  
  const params = new URLSearchParams();
  if (data.password !== confirmedPassword) {
    const errorString = "Please confirm your passwords are identical."
    params.set('error', errorString)
    redirect(`/sign-up?${params.toString()}`)
  }

  const { error } = await supabase.auth.signUp(data)
  console.log(error);

  if (error instanceof AuthApiError) {
    const errorString = "Username is already taken."
    params.set('error', errorString)
    redirect(`/sign-up?${params.toString()}`)
  }

  params.set('success', 'Congrats! Check your inbox for a confirmation email.')
  revalidatePath('/', 'layout')

  const redirectTo = formData.get('redirectTo') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    redirect(`/login?${params.toString()}`)
  }
}