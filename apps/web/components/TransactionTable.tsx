import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
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
    <TableHeader className="bg-[#f9fafb]">
      <TableRow>
      <TableHead className="px-2">Transaction</TableHead>
      <TableHead className="px-2">Amount</TableHead>
      <TableHead className="px-2">Status</TableHead>
      <TableHead className="px-2">Date</TableHead>
      <TableHead className="px-2 max-md:hidden">Channel</TableHead>
      <TableHead className="px-2 max-md:hidden">Category</TableHead>
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
            clsx('!over:bg-none border-b-default', {
              'bg-[#f5e0e0]': isDebit || amount[0] === '-',
              'bg-[#beefd0]': isCredit || amount[0] != '-',
            })
          }>
            <TableCell className="max-w-[250px] pl-2 pr-10">
              <div className="flex items-center gap-3">
                <h1 className="text-14 truncate font-semibold text-[#344054]">
                  {removeSpecialCharacters(t.name)}
                </h1>
              </div>
            </TableCell>
            <TableCell className={clsx( "pl-2 pr-10 font-semibold", {
              'text-[#f04438]': isDebit || amount[0] === '-',
              'text-[#039855]': isCredit || amount[0] != '-',
            })}>
              {isDebit ? `-${amount}` : isCredit ? `+${amount}` : amount}
            </TableCell>
            <TableCell className="pl-2 pr-10">
              <CategoryBadge category={status}/>
            </TableCell>
            <TableCell className="min-w-32 pl-2 pr-10">
              {formatDateTime(new Date(t.date)).dateTime}
            </TableCell>
            <TableCell className="capitalize min-w-24 pl-2 pr-10">
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