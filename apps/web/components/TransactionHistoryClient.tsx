"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import TransactionTable from "./TransactionTable"
import TransactionDetailSheet from "./TransactionDetailSheet"
import { Pagination } from "./Pagination"
import { formUrlQuery, formatAmount } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TransactionHistoryClientProps {
  accounts: Account[]
  transactions: Transaction[]
  currentAccount: Account
  currentPage: number
  totalTransactionCount: number
}

const ROWS_PER_PAGE = 10

export default function TransactionHistoryClient({
  accounts,
  transactions,
  currentAccount,
  currentPage,
  totalTransactionCount,
}: TransactionHistoryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Client-side search filtering
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions
    const query = searchQuery.toLowerCase()
    return transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
    )
  }, [transactions, searchQuery])

  // Pagination — when searching, paginate the filtered results client-side
  const isSearching = searchQuery.trim().length > 0
  const displayTransactions = isSearching
    ? filteredTransactions.slice(0, ROWS_PER_PAGE)
    : filteredTransactions
  const totalPages = isSearching
    ? Math.ceil(filteredTransactions.length / ROWS_PER_PAGE)
    : Math.ceil(totalTransactionCount / ROWS_PER_PAGE)

  const handleAccountChange = (itemId: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: itemId,
    })
    // Reset to page 1 when switching accounts
    const finalUrl = formUrlQuery({
      params: new URL(newUrl, window.location.origin).searchParams.toString(),
      key: "page",
      value: "1",
    })
    router.push(finalUrl, { scroll: false })
  }

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setSheetOpen(true)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 group/search">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image
              src="/icons/search.svg"
              width={16}
              height={16}
              alt="search"
              className="brightness-0 invert opacity-40 group-focus-within/search:opacity-70 transition-opacity"
            />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-[14px] rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-500/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-[16px] leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Account selector */}
        <Select
          value={currentAccount?.itemId}
          onValueChange={handleAccountChange}
        >
          <SelectTrigger className="flex gap-2 w-full sm:w-[240px] h-10 rounded-xl border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-[14px] text-slate-300 hover:border-white/[0.12] transition-all duration-200">
            <Image
              src="/icons/credit-card.svg"
              width={16}
              height={16}
              alt="account"
              className="brightness-0 invert opacity-50"
            />
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent
            className="w-[240px] bg-slate-900/95 backdrop-blur-xl border-white/[0.06]"
            align="end"
            position="popper"
          >
            <SelectGroup>
              <SelectLabel className="py-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Your Accounts
              </SelectLabel>
              {accounts.map((account: Account) => (
                <SelectItem
                  key={account.id}
                  value={account.itemId}
                  className="cursor-pointer rounded-lg hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-medium text-slate-200">{account.name}</p>
                    <p className="text-[12px] text-slate-500 font-(family-name:--font-jetbrains-mono)">
                      ●●●● {account.mask} · {formatAmount(account.currentBalance)}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Account summary card */}
      <div className="rounded-2xl border border-white/[0.05] bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-slate-900/40 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.03] to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-1">
          <h2 className="text-[17px] font-bold text-white">{currentAccount?.name}</h2>
          <p className="text-[13px] text-slate-500">{currentAccount?.officialName}</p>
          <p className="text-[13px] font-medium tracking-[1.5px] text-slate-400 mt-0.5">
            ●●●●● ●●●● ●●●● <span className="text-slate-300">{currentAccount?.mask || '1234'}</span>
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-start sm:items-end gap-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
          <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500">Current Balance</p>
          <p className="text-[22px] font-bold text-white font-(family-name:--font-jetbrains-mono) tabular-nums">
            {formatAmount(currentAccount?.currentBalance)}
          </p>
        </div>
      </div>

      {/* Transaction table or empty state */}
      {displayTransactions.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.05] bg-slate-900/30 overflow-hidden backdrop-blur-sm">
          <TransactionTable
            transactions={displayTransactions}
            onRowClick={handleRowClick}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl border border-white/[0.05] bg-slate-900/20">
          <div className="size-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <Image
              src="/icons/transaction.svg"
              width={28}
              height={28}
              alt="no transactions"
              className="brightness-0 invert opacity-30"
            />
          </div>
          <h3 className="text-[16px] font-semibold text-slate-400 mb-1">No transactions found</h3>
          <p className="text-[13px] text-slate-600 text-center max-w-[280px]">
            {searchQuery
              ? `No results matching "${searchQuery}". Try a different search term.`
              : "No transactions available for this account."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isSearching && (
        <div className="flex justify-center pt-2">
          <Pagination totalPages={totalPages} page={currentPage} />
        </div>
      )}
      {totalPages > 1 && isSearching && (
        <div className="flex justify-center pt-2">
          <p className="text-[13px] text-slate-500 font-(family-name:--font-jetbrains-mono) tabular-nums">
            Showing {Math.min(ROWS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} results
          </p>
        </div>
      )}

      {/* Detail sheet */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
