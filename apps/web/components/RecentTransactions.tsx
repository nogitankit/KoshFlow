import react from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionTable from './TransactionTable'
import { Pagination } from './Pagination'

export default function RecentTransactions({
  accounts,
  transactions = [],
  itemId,
  page
}: RecentTransactionsProps){
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

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
               <TransactionTable transactions={currentTransactions} />
               {totalPages > 1 && (
                <div className='my-4 w-full'>
                  {<Pagination  totalPages={totalPages} page={page} />}
                </div>
               )}
            </TabsContent>
          ))
        }

      </Tabs>
    </section>
  )
}