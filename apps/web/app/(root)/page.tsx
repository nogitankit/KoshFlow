import React from 'react'
import HeaderBox from '@/components/headerBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
import { redirect } from 'next/navigation'
import { getLoggedInUser, getAccounts, getAccount } from '@/lib/actions/cached'
import { toInr } from '@/lib/utils'
import RecentTransactions from '@/components/RecentTransactions'

const HomePage = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  if (!loggedIn) {
    redirect('/sign-in')
  }
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  const accountsData = accounts?.data?.map((a: any) => ({ ...a, currentBalance: toInr(a.currentBalance) }))
  const totalCurrentBalanceInr = toInr(accounts?.totalCurrentBalance)
  if(!accounts) return;
  const itemId = (id as string) || accountsData[0]?.itemId;
  const account = await getAccount({ itemId });
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
          accounts={accountsData}
          totalBanks={accounts?.totalBanks}
          totalCurrentBalance={totalCurrentBalanceInr}
        />
        </header>
        <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          itemId={itemId}
          page={currentPage}
        />
      </div>
      <RightSidebar
       user={loggedIn}  
       transactions={account.transactions}
       banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}
export default HomePage