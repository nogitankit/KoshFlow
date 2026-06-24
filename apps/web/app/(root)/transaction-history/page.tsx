import React from 'react'
import { redirect } from 'next/navigation'
import { getLoggedInUser, getAccounts, getAccount } from '@/lib/actions/cached'
import { toInr } from '@/lib/utils'
import HeaderBox from '@/components/headerBox'
import TransactionHistoryClient from '@/components/TransactionHistoryClient'

export default async function TransactionHistory({searchParams}: SearchParamProps) {
  const {id, page} = await searchParams
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  if (!loggedIn) {
    redirect('/sign-in')
  }
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  const accountsData = accounts?.data?.map((a: any) => ({ ...a, currentBalance: toInr(a.currentBalance) }))
  if(!accounts) return;
  const itemId = (id as string) || accountsData[0]?.itemId;
  const account = await getAccount({ itemId });

  const currentAccount = accountsData?.find((a: any) => a.itemId === itemId) || accountsData?.[0]

  const rowsPerPage = 10;
  const allTransactions = account?.transactions || [];
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = allTransactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return(
    <div className='transactions'>
      <div className='transactions-header'>
        <HeaderBox title="Transaction History" subtext="Browse, search, and inspect your transactions." />
      </div>
      <div className='space-y-5'>
        <TransactionHistoryClient
          accounts={accountsData}
          transactions={currentTransactions}
          currentAccount={currentAccount}
          currentPage={currentPage}
          totalTransactionCount={allTransactions.length}
        />
      </div>
    </div>
  )
}