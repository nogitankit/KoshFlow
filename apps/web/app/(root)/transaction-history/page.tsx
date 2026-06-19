import react from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { getAccounts, getAccount } from '@/lib/actions/bank.actions'
import { getUserInfo } from '@/lib/actions/user.actions'
import { formatAmount, toInr } from '@/lib/utils'
import HeaderBox from '@/components/headerBox'
import TransactionTable from '@/components/TransactionTable'
import { Pagination } from '@/components/Pagination'

export default async function TransactionHistory({searchParams}: SearchParamProps) {
  const {id, page} = await searchParams
  const currentPage = Number(page as string) || 1
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }
  const loggedIn = await getUserInfo({ userId: user.id })
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  const accountsData = accounts?.data?.map((a: any) => ({ ...a, currentBalance: toInr(a.currentBalance) }))
  const totalCurrentBalanceInr = toInr(accounts?.totalCurrentBalance)
  if(!accounts) return;
  const itemId = (id as string) || accountsData[0]?.itemId;
  const account = await getAccount({ itemId });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )
  return(
    <div className='transactions'> 
      <div className='transactions-header'>
        <HeaderBox title="Transaction History" subtext="See your bank details and transactions." />
      </div>
      <div className='space-y-6'>
        <div className='transactions-account'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-18 font-bold text-white'>
              {account?.data.name}
            </h2>
            <p className='text-14 text-blue-25'>
              {account?.data.officialName}
            </p>
            <p className='text-14 font-semibold tracking-[1.1px] text-white'>
              ●●●●● ●●●● ●●●● <span className='text-16'>{account?.data.mask || 1234 }</span>
            </p>
          <div className='transactions-account-balance'>
            <p className='text-14'>
              Current Balance
            </p>
            <p className='text-24 text-center font-bold '>
              {formatAmount(account?.data.currentBalance)}
            </p>
          </div>
        </div>
        <section className='flex flex-col w-full gap-6'>
          <TransactionTable  transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className='my-4 w-full'>
              {<Pagination  totalPages={totalPages} page={currentPage} />}
            </div>
          )}
        </section>
      </div>
    </div>
    </div>
  )
}