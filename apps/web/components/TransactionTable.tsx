import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, formatCategory, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";
import clsx from 'clsx'
import { transactionCategoryStyles } from "@/constants";

export function CategoryBadge({category}: CategoryBadgeProps){
  const {borderColor, backgroundColor, textColor,chipBackgroundColor} = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

  return(
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>
        {category}
      </p>
    </div>
  )
}

export default function TransactionTable({transactions}: TransactionTableProps){
  return(
    <Table>
    <TableHeader className="bg-slate-900/50">
      <TableRow className="border-b border-white/5 hover:bg-transparent">
      <TableHead className="px-2 text-slate-400">Transaction</TableHead>
      <TableHead className="px-2 text-slate-400">Amount</TableHead>
      <TableHead className="px-2 text-slate-400">Status</TableHead>
      <TableHead className="px-2 text-slate-400">Date</TableHead>
      <TableHead className="px-2 max-md:hidden text-slate-400">Channel</TableHead>
      <TableHead className="px-2 max-md:hidden text-slate-400">Category</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {
      transactions.map((t: Transaction) => {
        const status = getTransactionStatus(new Date(t.date))
        const amount = formatAmount(t.amount)
        const isDebit = t.type === 'debit'
        const isCredit = t.type === 'credit'
        return (
          <TableRow key={t.id} className={
            clsx('border-b border-white/5 hover:bg-white/5 transition-colors', {
              'bg-rose-950/15': isDebit || amount[0] === '-',
              'bg-emerald-950/15': isCredit || amount[0] != '-',
            })
          }>
            <TableCell className="max-w-[250px] pl-2 pr-10">
              <div className="flex items-center gap-3">
                <h1 className="text-14 truncate font-semibold text-slate-200">
                  {removeSpecialCharacters(t.name)}
                </h1>
              </div>
            </TableCell>
            <TableCell className={clsx( "pl-2 pr-10 font-semibold", {
              'text-rose-400': isDebit || amount[0] === '-',
              'text-emerald-400': isCredit || amount[0] != '-',
            })}>
              {isDebit ? `-${amount}` : isCredit ? `+${amount}` : amount}
            </TableCell>
            <TableCell className="pl-2 pr-10">
              <CategoryBadge category={status}/>
            </TableCell>
            <TableCell className="min-w-32 pl-2 pr-10 text-slate-400">
              {formatDateTime(new Date(t.date)).dateTime}
            </TableCell>
            <TableCell className="capitalize min-w-24 pl-2 pr-10 text-slate-400">
              {t.paymentChannel}
            </TableCell>
            <TableCell className=" pl-2 pr-10 max-md:hidden">
              <CategoryBadge category={formatCategory(t.category)} />
            </TableCell>
          </TableRow>
        )
})
    }
  </TableBody>
  </Table>
  )
}