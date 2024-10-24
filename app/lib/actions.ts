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
    redirect('/projects')
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const nameInput = formData.get('name') as string
  const loginData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // attempt login
  const { error: loginError } = await supabase.auth.signInWithPassword(loginData)
  if (!loginError) {
    redirect('/projects')
  }

  // signup
  const signUpData = {
    ...loginData,
    options: {
      data: {
        name: nameInput,
      }
    }
  }
  const { error } = await supabase.auth.signUp(signUpData)


  const params = new URLSearchParams();
  // on error, return with message
  if (error instanceof AuthApiError) {
    const errorString = "Oops, account creation failed!"
    params.set('error', errorString)
    redirect(`/sign-up?${params.toString()}`)
  }
  revalidatePath('/', 'layout')

  // on success, redirect to login with message
  const redirectTo = formData.get('redirectTo') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    params.set('success', 'Congrats! Check your inbox for a confirmation email.')
    params.set('redirectTo', '/projects')
    redirect(`/login?${params.toString()}`)
  }
}