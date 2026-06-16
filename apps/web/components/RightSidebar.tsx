import react from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BankCard from './BankCard'
import type { User } from '@supabase/supabase-js'

export default function RightSidebar({user, transactions, banks}: { user: User, transactions: Transaction[], banks: any[] }) {
  const firstName = user?.user_metadata?.first_name || user?.email || 'User'
  const lastName = user?.user_metadata?.last_name || ''
  return(
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-7'>
        <div className='profile-banner' />
        <div className='profile'>
          <div className='profile-img'>
            <span className='text-5xl font-bold text-blue-500'>{firstName[0]?.toUpperCase()}</span>
          </div>
          <div className='profile-details'>
            <h1 className='profile-name'>
              {firstName} {lastName}
            </h1>
            <p className='profile-email'>
              {user?.email || ''}
            </p>
          </div>
        </div>
      </section>
      <section className='banks'>
        <div className='flex w-full justify-between'>
          <h2 className='header-2'>My Banks</h2>
          <Link href='/' className='flex gap-2'>
            <Image src='/icons/plus.svg' width={20} height={20} alt='plus' />
            <h2 className='text-14 font-semibold text-gray-600'>
              Add Bank
            </h2>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className='relative flex flex-1 flex-col items-center justify-center gap-5'>
            <div className='relative z-10'>
              <BankCard 
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`}
                showBalance={false}
              />
            </div>
            {banks[1] &&  (
              <div className='absolute right-0 top-8 z-0 w-[90%]'>
                <BankCard 
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`}
                  showBalance={false}
                />
              </div>
            )}

          </div>
        )}
      </section>
    </aside>
  )
}