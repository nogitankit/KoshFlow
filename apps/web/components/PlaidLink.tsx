import react, { SetStateAction, useCallback, useEffect } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOptions } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';
import Image from 'next/image'


export default function PlaidLink({user, variant}: PlaidLinkProps){
  const [token, setToken] = react.useState('');
  const router = useRouter()
  
  react.useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user)
      if (data) setToken(data)
    }
    getLinkToken()
  }, [user])

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token : string) => {
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

  const {open, ready} = usePlaidLink(config)

  return(
    <>
      {variant === 'primary' ? (
        <Button className='plaidlink-primary' onClick={() => open()} disabled={!ready}>
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button onClick={() => open()} disabled={!ready} className='plaidlink-ghost'>
          <Image  src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24}  />
          <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
        </Button>
      ) : (
        <Button onClick={() => open()} disabled={!ready} className='plaidlink-default'>
          <Image  src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24}  />
          <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
        </Button>
      )} 
    </>
  )
}