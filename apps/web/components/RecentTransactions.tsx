import react from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionTable from './TransactionTable'

export default function RecentTransactions({
  accounts,
  transactions = [],
  itemId,
  page
}: RecentTransactionsProps){
  return (
    <section className='recent-transactions'>
      <header className='flex items-center justify-between'>
        <h2 className='recent-transactions-label'>
          Recent Transactions
        </h2>
        <Link href={`/transaction-history/?id=${itemId}`} className='view-all-btn'>
        View all
        </Link>
      </header>
      <Tabs defaultValue={itemId} className="w-[w-full]">
        <TabsList className='recent-transactions-tablist'>
          {accounts.map((a: Account) => (
            <TabsTrigger key={a.id} value={a.id}>
              <BankTabItem key={a.id} account={a} itemId={itemId} />
            </TabsTrigger>
          ))}
        </TabsList>
        {
          accounts.map((a: Account) => (
            <TabsContent
              value = {a.itemId}
              key={a.id}
              className='space-y-4'
            >
               <BankInfo account={a} itemId={itemId} type='full'/>
               <TransactionTable transactions={transactions} />
            </TabsContent>
          ))
        }

      </Tabs>
    </section>
  )
}