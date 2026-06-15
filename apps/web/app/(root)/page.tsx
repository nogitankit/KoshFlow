import React from 'react'
import HeaderBox from '@/components/headerBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const HomePage = async () => {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  const loggedIn = {
    firstName: user.user_metadata?.first_name || 'Guest',
    lastName: user.user_metadata?.last_name || '',
    email: user.email || '',
  }

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
          accounts={[]}
          totalBanks={1}
          totalCurrentBalance={69.420}
        />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar
       user={user}  
       transactions={[]}
       banks={[{currentBalance: 69.32}, {currentBalance: 500.02}]}
      />
    </section>
  )
}
export default HomePage