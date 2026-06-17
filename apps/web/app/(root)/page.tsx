import React from 'react'
import HeaderBox from '@/components/headerBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAccounts, getAccount } from '@/lib/actions/bank.actions'
import { getUserInfo } from '@/lib/actions/user.actions'

const HomePage = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }
  const loggedIn = await getUserInfo({ userId: user.id })
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  const accountsData = accounts?.data
  if(!accounts) return;
  const itemId = (id as string) || accountsData[0]?.itemId;
  const account = await getAccount({ itemId });

  console.log({
    accountsData,
    account
  })

  return(
    <section className='home'>
      <div className="home-content">
        <header className='home-header'>
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Welcome to KoshFlow. Manage your Accounts and Transactions Securely and Efficiently."
          />
        
        <TotalBalanceBox 
          accounts={[accountsData]}
          totalBanks={accounts?.totalBanks}
          totalCurrentBalance={accounts?.totalCurrentBalance}
        />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar
       user={loggedIn}  
       transactions={accounts?.transactions}
       banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}
export default HomePage