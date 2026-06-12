'use client'
import react from 'react'
import CountUp from 'react-countup'

export default function Counter({amount}: {amount: number}) {
  return(
    <CountUp className='w-full' end={amount} decimals={2} prefix='₹' />
  )
}