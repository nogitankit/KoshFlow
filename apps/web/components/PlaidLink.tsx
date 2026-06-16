import react, { SetStateAction, useCallback, useEffect } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOptions } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';


export default function PlaidLink({user, variant}: PlaidLinkProps){
  const [token, setToken] = react.useState('');
  const router = useRouter()
  console.log(user)
  
  react.useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user)
      setToken(data)
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
        <Button>
          Connect bank
        </Button>
      ) : (
        <Button>
          Connect bank
        </Button>
      )} 
    </>
  )
}