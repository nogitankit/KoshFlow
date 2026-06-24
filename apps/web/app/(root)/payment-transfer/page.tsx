import HeaderBox from '@/components/headerBox'
import { redirect } from 'next/navigation'
import React from 'react'
import { getLoggedInUser, getAccounts } from '@/lib/actions/cached'
import { toInr } from '@/lib/utils'
import PaymentTransferWizard from '@/components/PaymentTransferWizard'

export default async function PaymentTransfer() {
  const loggedIn = await getLoggedInUser()
  if (!loggedIn) {
    redirect('/sign-in')
  }
  const accounts = await getAccounts({userId: loggedIn.userId}) 
  const accountsData = accounts?.data
  return(
    <section className='payment-transfer'>
      <HeaderBox title='Payment Transfer' subtext='Please provide any specific details or notes related to payment transfer' />
      <section className='size-full pt-5'>
        <PaymentTransferWizard accounts={accountsData} />
      </section>
    </section>
  )
}