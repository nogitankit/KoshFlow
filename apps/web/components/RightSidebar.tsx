import react from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'

export default function RightSidebar({user, transactions, banks}: RightSidebarProps) {
  const firstName = user?.firstName || user?.email || 'User'
  const name = `${user?.firstName} ${user?.lastName}` 
  const categories: CategoryCount[] = countTransactionCategories(transactions)
  return(
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-7'>
        <div className='profile-banner' />
        <div className='profile'>
          <div className='profile-img' style={{
            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.1)'
          }}>
            <span className='text-5xl font-bold bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent'>{firstName[0]?.toUpperCase()}</span>
          </div>
          <div className='profile-details'>
            <h1 className='profile-name'>
              {name}
            </h1>
            <p className='profile-email'>
              {user?.email || ''}
            </p>
          </div>
        </div>
      </section>
      <section className='banks'>
        <div className='flex w-full justify-between items-center'>
          <h2 className='text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-400'>My Banks</h2>
          <Link href='/' className='flex gap-2 items-center group'>
            <Image src='/icons/plus.svg' width={16} height={16} alt='plus' className='brightness-0 invert opacity-50 group-hover:opacity-100 transition-opacity' />
            <span className='text-[12px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors'>
              Add Bank
            </span>
          </Link>
        </div>
        {banks && banks[0] && (
          <div className='relative flex flex-1 flex-col items-center justify-center gap-5 group/stack'>
            <div className='relative z-10 transition-transform duration-500 ease-out group-hover/stack:translate-y-[-4px]'>
              <BankCard 
                key={banks[0].id}
                account={banks[0]}
                userName={name}
                showBalance={false}
              />
            </div>
            {banks[1] &&  (
              <div className='absolute right-0 top-8 z-0 w-[90%] transition-all duration-500 ease-out group-hover/stack:translate-x-[6px] group-hover/stack:translate-y-[4px] group-hover/stack:rotate-[2deg] opacity-70 group-hover/stack:opacity-90'>
                <BankCard 
                  key={banks[1].id}
                  account={banks[1]}
                  userName={name}
                  showBalance={false}
                />
              </div>
            )}

          </div>
        )}
        <div className='mt-10 flex flex-1 flex-col gap-6'>
          <h2 className='text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-400'>
            Top Categories
          </h2> 
          <div className='space-y-4'>
            {categories.map((category, index) => (
              <div key={category.name} className='animate-fadeInUp' style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
                <Category category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}
