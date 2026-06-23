import react from 'react'
import { formatAmount } from '@/lib/utils'
import Counter from '@/components/Counter'
import Doughnut from '@/components/Doughnut'

export default function TotalBalanceBox({accounts=[], totalBanks, totalCurrentBalance}: TotalBalanceBoxProps){
  return(
    <section className="total-balance">
      <div className="total-balance-chart">
      <Doughnut accounts={accounts}/>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-400">
            Bank Accounts
          </h2>
          <span className="text-slate-600">·</span>
          <span className="text-[13px] font-semibold text-indigo-400 font-(family-name:--font-jetbrains-mono)">
            {totalBanks}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Total Current Balance
          </p>

          <div className="total-balance-amount flex-center gap-2">
            <Counter amount={totalCurrentBalance}/>
          </div>
        </div>
      </div>
    </section>
  )
}
