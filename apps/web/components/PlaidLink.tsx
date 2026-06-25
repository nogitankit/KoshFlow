"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOptions } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import GlareHover from './GlareHover'

export default function PlaidLink({ user, variant, onClick }: PlaidLinkProps & { onClick?: (e: React.MouseEvent) => void }) {
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

  const handleConnectClick = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (!isDisabled) open();
  };

  return (
    <>
      {variant === 'primary' ? (
        <GlareHover
          width="100%"
          height="48px"
          background="var(--primary)"
          borderRadius="12px"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={250}
          className="flex items-center justify-center gap-3 px-4 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 active:translate-y-px transition-all duration-200"
          style={{ 
            cursor: isDisabled ? 'not-allowed' : 'pointer', 
            opacity: isDisabled ? 0.6 : 1,
            pointerEvents: isDisabled ? 'none' : 'auto'
          }}
          onClick={handleConnectClick}
        >
          <span className="font-semibold text-16 text-white">Connect bank</span>
        </GlareHover>
      ) : variant === 'ghost' ? (
        <Button onClick={handleConnectClick} disabled={isDisabled} className='plaidlink-ghost'>
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
        <GlareHover
          width="100%"
          height="48px"
          background="var(--primary)"
          borderRadius="12px"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={250}
          className="flex items-center justify-center gap-3 px-4 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 active:translate-y-px transition-all duration-200"
          style={{ 
            cursor: isDisabled ? 'not-allowed' : 'pointer', 
            opacity: isDisabled ? 0.6 : 1,
            pointerEvents: isDisabled ? 'none' : 'auto'
          }}
          onClick={handleConnectClick}
        >
          <Image 
            src='/icons/connect-bank.svg' 
            alt='connect bank' 
            width={24} 
            height={24} 
            className={cn('brightness-0 invert', isDisabled ? 'opacity-60' : 'opacity-100')} 
          />
          <p className='text-[16px] font-semibold text-white'>Connect bank</p>
        </GlareHover>
      )} 
    </>
  )
}