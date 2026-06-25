"use client";

import React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formUrlQuery } from '@/lib/utils'
import BankInfo from './BankInfo'
import TransactionTable from './TransactionTable'
import { Pagination } from './Pagination'

export default function RecentTransactions({
  accounts,
  transactions = [],
  itemId,
  page
}: RecentTransactionsProps){
  const router = useRouter();
  const searchParams = useSearchParams();

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  const handleTabChange = (newId: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: newId,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <section className='recent-transactions w-full'>
      <header className='flex items-center justify-between mb-4'>
        <div className='flex flex-col gap-1'>
          <span className='text-[11px] uppercase tracking-[0.12em] font-bold text-indigo-400/80'>Activity</span>
          <h2 className='recent-transactions-label'>
            Recent Transactions
          </h2>
        </div>
        <Link href={`/transaction-history/?id=${itemId}`} className='view-all-btn group inline-flex items-center gap-2'>
          View all
          <span className='inline-block transition-transform duration-200 group-hover:translate-x-0.5'>→</span>
        </Link>
      </header>

      <Tabs value={itemId} onValueChange={handleTabChange} className="w-full">
        <TabsList className='recent-transactions-tablist'>
          {accounts.map((a: Account) => (
            <TabsTrigger 
              key={a.id} 
              value={a.itemId}
              className="recent-transactions-trigger"
            >
              {a.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {accounts.map((a: Account) => (
          <TabsContent
            value={a.itemId}
            key={a.id}
            className='space-y-6 focus-visible:outline-none'
          >
             <BankInfo account={a} itemId={itemId} type='full'/>
             <TransactionTable transactions={currentTransactions} />
             {totalPages > 1 && (
              <div className='my-6 w-full'>
                <Pagination totalPages={totalPages} page={page} />
              </div>
             )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}