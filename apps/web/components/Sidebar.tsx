'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import PlaidLink from './PlaidLink'

import ShinyText from './ShinyText'

export default function Sidebar({user}: SidebarProps) {
  const pathName = usePathname() 
  return(
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href='/' className='mb-10 cursor-pointer items-center gap-3 flex'>
          <Image
            src='/icons/logo.svg'
            width={34}
            height={34}
            alt='logo'
            className='size-8.5 max-xl:size-14'
          />
          <h1 className='sidebar-logo flex items-center'>
            <ShinyText text="KoshFlow" speed={3} color="#ffffff" shineColor="#818cf8" />
          </h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
          return(
            <Link href={item.route} key={item.label}
              className={cn('sidebar-link', {
                'bg-indigo-600/15 border border-indigo-500/20 shadow-lg shadow-indigo-600/5': isActive,
                'hover:bg-white/5': !isActive,
              })}
            >
              <div className='relative size-6'>
                <Image src={item.imgURL} alt={item.label} fill
                  className={cn('transition-all duration-200', {
                    'brightness-[3] invert-0': isActive,
                    'opacity-60': !isActive,
                  })}
                />
              </div>
              <p className={cn(
                'sidebar-label transition-colors duration-200', {
                'text-indigo-300!': isActive,
                'hover:text-slate-200': !isActive,
              })} 
              >{item.label}</p>
            </Link>
          )
        })}
        <PlaidLink user={user} />
      </nav>
      <Footer user={user} />
    </section>
  )
}