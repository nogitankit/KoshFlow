'use server'
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Sign-in error:', err);
    throw err;
  }
}

export async function signUp(userData: SignUpParams) {
  const { email, password, firstName, lastName } = userData;

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) {
      throw error;
    }

    console.log('✅ Sign-up successful, user:', JSON.stringify(data.user, null, 2));

    // Handle the case where email confirmation is required
    // data.user will exist but data.session may be null
    if (data?.user && !data?.session) {
      return {
        success: true,
        message: 'Please check your email to confirm your account.',
        user: data.user,
      };
    }

    return {
      success: true,
      message: 'Account created successfully.',
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    console.error('Sign-up error:', err);
    throw err;
  }
}

export async function logOut() {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  catch (err) {
    console.error('Logout error:', err)
    throw err
  }
  redirect('/sign-in')
}