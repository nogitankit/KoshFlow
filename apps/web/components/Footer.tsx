'use client'

import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Footer({user, type}: { user: User, type: string }){
  const router = useRouter()
  const name = user.user_metadata.full_name
  const firstName = user?.user_metadata?.first_name || user?.email || 'User'
  const email = user.user_metadata.email

  const handleLogOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut();
    router.push('/sign-in'); 
  }
  return (
    <footer className='footer'>
      <div className={clsx({
        'footer-name': type === 'desktop',
        'footer-name_mobile': type === 'mobile',
      })}>
        <p className='text-xl font-bold text-gray-700'>
          {firstName[0]?.toUpperCase()}
        </p>
      </div>
      <div className={clsx({
        'footer_email-mobile' : type === 'mobile',
        'footer_email': type === 'desktop',
      })}>
        <h1 className='text-14 truncate font-semibold text-gray-700'>
          {name}
        </h1>
        <p className='text-14 truncate font-normal text-gray-600'>
          {email}
        </p>
      </div>
      <div className='footer_image' onClick={handleLogOut}>
        <Image src='/icons/logout.svg' width={20} height={20}  alt='logout'/>
      </div>
    </footer>
  )
} 