import { cache } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo as uncachedGetUserInfo, getBanks as uncachedGetBanks } from './user.actions';
import { getAccounts as uncachedGetAccounts, getAccount as uncachedGetAccount } from './bank.actions';

export const getLoggedInUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const userInfo = await uncachedGetUserInfo({ userId: user.id });
    return userInfo;
  } catch (error) {
    console.error("Error in getLoggedInUser:", error);
    return null;
  }
});

export const getAccounts = cache(async ({ userId }: getAccountsProps) => {
  return uncachedGetAccounts({ userId });
});

export const getAccount = cache(async ({ itemId }: { itemId: string }) => {
  return uncachedGetAccount({ itemId });
});

export const getBanks = cache(async ({ userId }: getBanksProps) => {
  return uncachedGetBanks({ userId });
});
