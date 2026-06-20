import HeaderBox from '@/components/headerBox'
import BankCard from '@/components/BankCard'
import { redirect } from 'next/navigation'
import { getLoggedInUser, getAccounts } from '@/lib/actions/cached'
import { toInr } from '@/lib/utils'
export default async function MyBanks() {
  const loggedIn = await getLoggedInUser()
  if (!loggedIn) {
    redirect('/sign-in')
  }
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  if(!accounts) return;
  
  return(
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox  title="My Bank Accounts" subtext="Manage your bank accounts securely and efficiently." />
        <div className='space-y-4'>
          <h2 className='text-18 font-bold text-white'>
            Your cards
          </h2>
          <div className='flex flex-wrap gap-6'>
            {accounts.data.map((a: Account) => (
              <BankCard key={a.id} account={a} userName={loggedIn?.firstName}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}