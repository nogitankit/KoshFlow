import react from 'react' 
import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'

export default function Footer({user, type}: { user: User, type: string }){
  const firstName = user?.user_metadata?.first_name || user?.email || 'User'
  return (
    <footer className='footer'>
      <div className={clsx({
        'footer-name': type === 'desktop',
        ''
      })}>
        <p className='text-xl'>
          {firstName[0]?.toUpperCase()}
        </p>

      </div>
    </footer>
  )
}