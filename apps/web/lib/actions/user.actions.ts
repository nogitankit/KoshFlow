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
        client_user_id: user.$id || user.id,
      },
      client_name: user.name || `${user.firstName} ${user.lastName}`,
      products:['auth'] as Products[],
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
  fundingSourceUrl,
  shareableId}: createBankAccountProps){
    try{
      const cookieStore = await cookies();
      const supabase = await createClient(cookieStore);

      const { data, error } = await supabase
        .from('banks')
        .insert({
          user_id: userId,
          bank_id: bankId,
          account_id: accountId,
          access_token: accessToken,
          funding_source_url: fundingSourceUrl,
          shareable_id: shareableId,
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
    //get account info from plaid using access token
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountResponse.data.accounts[0];
    //create a processor token for Dwolla using the access token & account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    const processorTokenResponse = await plaidClient.processorTokenCreate(request)
    const processorToken = processorTokenResponse.data.processor_token
    //funding source url 
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    })
    if(!fundingSourceUrl) throw Error('Failed to add funding source')
    //create bank account
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id)
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