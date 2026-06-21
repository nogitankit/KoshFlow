'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Footer({user, type}: FooterProps){
  const router = useRouter()
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'
  const firstName = user?.firstName || user?.email || 'User'
  const email = user?.email || ''

  const handleLogOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut();
    router.push('/sign-in'); 
  }
  return (
    <footer className='footer'>
      <div className={clsx({
        'footer_name': type === 'desktop',
        'footer_name-mobile': type === 'mobile',
      })}>
        <p className='text-xl font-bold text-indigo-400'>
          {firstName[0]?.toUpperCase()}
        </p>
      </div>
      <div className={clsx({
        'footer_email-mobile' : type === 'mobile',
        'footer_email': type === 'desktop',
      })}>
        <h1 className='text-14 truncate font-semibold text-slate-200'>
          {name}
        </h1>
        <p className='text-14 truncate font-normal text-slate-400'>
          {email}
        </p>
      </div>
      <div className='footer_image' onClick={handleLogOut}>
        <Image src='/icons/logout.svg' width={20} height={20} alt='logout' className='brightness-0 invert opacity-60 hover:opacity-100 transition-opacity cursor-pointer'/>
      </div>
    </footer>
  )
}
 