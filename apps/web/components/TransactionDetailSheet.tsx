"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { CategoryBadge } from "./TransactionTable"
import { formatAmount, formatDateTime, formatCategory, getTransactionStatus } from "@/lib/utils"
import clsx from "clsx"

interface TransactionDetailSheetProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TransactionDetailSheet({ transaction, open, onOpenChange }: TransactionDetailSheetProps) {
  if (!transaction) return null

  const amount = formatAmount(transaction.amount)
  const isDebit = transaction.type === 'debit'
  const isCredit = transaction.type === 'credit'
  const status = getTransactionStatus(new Date(transaction.date))
  const { dateTime, dateOnly, timeOnly } = formatDateTime(new Date(transaction.date))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-white/5 bg-slate-950/95 backdrop-blur-xl p-0 overflow-y-auto"
      >
        {/* Header band */}
        <div className={clsx(
          "relative px-6 pt-8 pb-6",
          isDebit ? "bg-gradient-to-br from-rose-950/40 to-transparent" : "bg-gradient-to-br from-emerald-950/40 to-transparent"
        )}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')] opacity-[0.03] bg-repeat bg-[length:200px_200px]" />
          <SheetHeader className="p-0 relative z-10">
            <SheetDescription className="text-[11px] uppercase tracking-[0.15em] font-semibold text-slate-500 mb-1">
              Transaction Details
            </SheetDescription>
            <SheetTitle className="text-xl font-bold text-white leading-tight">
              {transaction.name}
            </SheetTitle>
          </SheetHeader>

          {/* Amount */}
          <div className="mt-5">
            <p className={clsx(
              "text-3xl font-bold font-(family-name:--font-jetbrains-mono) tabular-nums tracking-tight",
              isDebit ? "text-rose-400" : "text-emerald-400"
            )}>
              {isDebit ? `-${amount}` : isCredit ? `+${amount}` : amount}
            </p>
            <p className="text-[13px] text-slate-500 mt-1">{dateTime}</p>
          </div>
        </div>

        {/* Detail sections */}
        <div className="px-6 py-6 space-y-1">

          {/* Status & Category row */}
          <div className="grid grid-cols-2 gap-3">
            <DetailCard label="Status">
              <CategoryBadge category={status} />
            </DetailCard>
            <DetailCard label="Category">
              <CategoryBadge category={formatCategory(transaction.category)} />
            </DetailCard>
          </div>

          {/* Date breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <DetailCard label="Date">
              <span className="text-[14px] text-slate-200">{dateOnly}</span>
            </DetailCard>
            <DetailCard label="Time">
              <span className="text-[14px] text-slate-200">{timeOnly}</span>
            </DetailCard>
          </div>

          {/* Channel */}
          <DetailCard label="Payment Channel">
            <span className="text-[14px] text-slate-200 capitalize">{transaction.paymentChannel || transaction.channel || '—'}</span>
          </DetailCard>

          {/* Type */}
          <DetailCard label="Transaction Type">
            <span className={clsx(
              "text-[14px] font-medium capitalize",
              isDebit ? "text-rose-400" : "text-emerald-400"
            )}>
              {transaction.type}
            </span>
          </DetailCard>

          {/* Account ID */}
          {transaction.accountId && (
            <DetailCard label="Account ID">
              <span className="text-[13px] text-slate-400 font-(family-name:--font-jetbrains-mono)">{transaction.accountId}</span>
            </DetailCard>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailCard({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] px-4 py-3 hover:border-white/[0.08] transition-colors duration-200">
      <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500 mb-1.5">{label}</p>
      <div>{children}</div>
    </div>
  )
}
