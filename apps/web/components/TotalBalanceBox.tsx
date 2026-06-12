import react from 'react'
import { formatAmount } from '@/lib/utils'
import Counter from './Counter'

export default function TotalBalanceBox({accounts=[], totalBanks, totalCurrentBalance}: TotalBalanceBoxProps){
  const formattedBalance = formatAmount(totalCurrentBalance)
  console.log(typeof(totalCurrentBalance))
    return(
    <section className="total-balance">
      <div className="total-balance-chart">
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="header-2">
          Bank Accounts: {totalBanks}
        </h2>
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
