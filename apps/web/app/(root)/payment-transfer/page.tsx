import HeaderBox from '@/components/headerBox'
import react from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { getAccounts } from '@/lib/actions/bank.actions'
import { getUserInfo } from '@/lib/actions/user.actions'
import { toInr } from '@/lib/utils'
import PaymentTransferForm from '@/components/PaymentTransferForm'
export default async function PaymentTransfer() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
   const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }
  const loggedIn = await getUserInfo({ userId: user.id })
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  const accountsData = accounts?.data
  return(
    <section className='payment-transfer'>
      <HeaderBox title='Payment Transfer' subtext='Please provide any specific details or notes related to payment transfer' />
      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accountsData} />

      </section>
    </section>
  )
}