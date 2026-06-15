import react from 'react'
import AuthForm from '@/components/AuthForm'
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
export default async function SignUp() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user)
  return(
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type='sign-up' />
    </section>
  )
}