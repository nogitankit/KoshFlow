import React from 'react'
import HeaderBox from '@/components/headerBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
const HomePage = () => {
  const loggedIn = {
    firstName: 'Superuser',
    lastName: 'SU',
    email: 'nomailankit@gmail.com'
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
       user={loggedIn}  
       transactions={[]}
       banks={[{currentBalance: 69.32}, {currentBalance: 500.02}]}
      />
    </section>
  )
}
export default HomePage