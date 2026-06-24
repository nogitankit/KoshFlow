"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOptions } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function PlaidLink({ user, variant }: PlaidLinkProps) {
  const [token, setToken] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user)
      if (data) setToken(data)
    }
    getLinkToken()
  }, [user])

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    await exchangePublicToken({
      publicToken: public_token,
      user,
    })
    router.push('/')
  }, [user])

  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  const { open, ready } = usePlaidLink(config)

  const isDisabled = !mounted || !ready

  return (
    <>
      {variant === 'primary' ? (
        <Button className='plaidlink-primary' onClick={() => open()} disabled={isDisabled}>
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button onClick={() => open()} disabled={isDisabled} className='plaidlink-ghost'>
          <Image 
            src='/icons/connect-bank.svg' 
            alt='connect bank' 
            width={24} 
            height={24} 
            className={cn('brightness-0 invert', isDisabled ? 'opacity-60' : 'opacity-100')} 
          />
          <p className='hidden text-[16px] font-semibold text-slate-400 xl:block'>Connect bank</p>
        </Button>
      ) : (
        <Button onClick={() => open()} disabled={isDisabled} className='plaidlink-default'>
          <Image 
            src='/icons/connect-bank.svg' 
            alt='connect bank' 
            width={24} 
            height={24} 
            className={cn('brightness-0 invert', isDisabled ? 'opacity-60' : 'opacity-100')} 
          />
          <p className='text-[16px] font-semibold text-slate-400'>Connect bank</p>
        </Button>
      )} 
    </>
  )
}