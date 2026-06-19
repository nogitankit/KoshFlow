'use server'
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CountryCode, Products } from "plaid";

import { plaidClient } from "@/lib/plaid";
import { encryptId, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";


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

export async function getUserInfo({ userId }: getUserInfoProps) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;

    return parseStringify(data);
  } catch (err) {
    console.error('Error getting user info:', err);
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
      throw new Error('Error creating user:'+ error);
    }



    const { password: _, ...profileData } = userData;

    const { data: newUser, error: newUserError } = await supabase
      .from('users')
      .insert({
        ...profileData,
        userId: data.user?.id,
      })
      .select()
      .single();

    if (newUserError) {
      console.error('Supabase insert error:', JSON.stringify(newUserError, null, 2));
      throw new Error('Error saving user profile to database');
    }

    // Handle the case where email confirmation is required
    // data.user will exist but data.session may be null
    if(data?.user && !data?.session) {
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

export async function createLinkToken(user: User){
  try{
    const tokenParams = {
      user:{
        client_user_id: user.$id || user.userId,
      },
      client_name: user.name || `${user.firstName} ${user.lastName}`,
      products:['auth', 'transactions'] as Products[],
      language: 'en',
      country_codes:['US'] as CountryCode[],
    }
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return response.data.link_token; 
  }
  catch(err){
    console.error('Error creating link token:', err)
  }
}

export async function createBankAccount(
  {userId,
  bankId,
  accountId,
  accessToken,
  shareableId}: createBankAccountProps){
    try{
      const cookieStore = await cookies();
      const supabase = await createClient(cookieStore);

      const { data, error } = await supabase
        .from('banks')
        .insert({
          userId: userId,
          bankId: bankId,
          accountId: accountId,
          access_token: accessToken,
          shareableId: shareableId,
        })
        .select()
        .single();

      if (error) throw error;

      return parseStringify(data);
    }
    catch(err){
      console.error('Error creating bank account:', err);
    }
}

export async function exchangePublicToken({publicToken, user}: exchangePublicTokenProps){
  try{
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    // Get account info from Plaid using access token
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountResponse.data.accounts[0];

    // Create bank account record with Plaid access token
    await createBankAccount({
      userId: user.$id || user.userId,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      shareableId: encryptId(accountData.account_id)
    })

    revalidatePath('/')
    return parseStringify({
      publicTokenExchange: "complete"
    })
  }
  catch(err){
    console.error(err)
  }
}

export async function getBanks({ userId }: getBanksProps) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;

    return parseStringify(data);
  } catch (err) {
    console.error('Error getting banks:', err);
    return [];
  }
}

export async function getBank({ documentId }: getBankProps) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .eq('accountId', documentId)
      .single();

    if (error) throw error;

    return parseStringify(data);
  } catch (err) {
    console.error('Error getting bank:', err);
    throw err;
  }
}

export async function getBankByAccountId({ accountId }: getBankByAccountIdProps) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .eq('accountId', accountId)
      .maybeSingle();

    if (error) throw error;

    return parseStringify(data);
  } catch (err) {
    console.error('Error getting bank:', err);
    throw err;
  }
}