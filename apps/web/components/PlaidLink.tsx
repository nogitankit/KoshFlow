import react, { SetStateAction, useCallback, useEffect } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOptions } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';
import Image from 'next/image'


export default function PlaidLink({user, variant}: PlaidLinkProps){
  const [token, setToken] = react.useState('');
  const [mounted, setMounted] = react.useState(false);
  const router = useRouter()

  react.useEffect(() => {
    setMounted(true);
  }, []);
  
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

  if (!mounted) {
    return (
      <>
        {variant === 'primary' ? (
          <Button className='plaidlink-primary' disabled={true}>
            Connect bank
          </Button>
        ) : variant === 'ghost' ? (
          <Button disabled={true} className='plaidlink-ghost'>
            <Image src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} className='brightness-0 invert opacity-60' />
            <p className='hidden text-[16px] font-semibold text-slate-400 xl:block'>Connect bank</p>
          </Button>
        ) : (
          <Button disabled={true} className='plaidlink-default'>
            <Image src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} className='brightness-0 invert opacity-60' />
            <p className='text-[16px] font-semibold text-slate-400'>Connect bank</p>
          </Button>
        )}
      </>
    );
  }

  return(
    <>
      {variant === 'primary' ? (
        <Button className='plaidlink-primary' onClick={() => open()} disabled={!ready}>
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button onClick={() => open()} disabled={!ready} className='plaidlink-ghost'>
          <Image  src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} className='brightness-0 invert opacity-60' />
          <p className='hidden text-[16px] font-semibold text-slate-400 xl:block'>Connect bank</p>
        </Button>
      ) : (
        <Button onClick={() => open()} disabled={!ready} className='plaidlink-default'>
          <Image  src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} className='brightness-0 invert opacity-60' />
          <p className='text-[16px] font-semibold text-slate-400'>Connect bank</p>
        </Button>
      )} 
    </>
  )
}