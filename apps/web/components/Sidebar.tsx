'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { BrickWall } from 'lucide-react'
export default function Sidebar({user}: SidebarProps) {
  const pathName = usePathname() 
  return(
    <section className='sidebar'>
      <nav className='flex flex-col gap-5'>
        <Link href='/' className='mb-10 cursor-pointer items-center gap-3 flex'>
          <Image
            src='/icons/logo.svg'
            width={34}
            height={34}
            alt='logo'
            className='size-8.5 max-xl:size-14'
          />
          <h1 className='sidebar-logo'>KoshFlow</h1>
        </Link>
        {sidebarLinks.map((item) =>{

        const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
        // dynamically applying styles using clsx and twMerge
        return(
          <Link href={item.route} key={item.label}
          className={cn('sidebar-link', {
            'bg-bank-gradient' : isActive
          })}
          >
            <div className='relative size-6'>
              <Image src={item.imgURL} alt={item.label} fill
              className={cn({
                'brightness-[3] invert-0' : isActive 
              })}
              />
            </div>
            <p className={cn(
              'sidebar-label',{
              '!text-white': isActive
            })} 
            >{item.label}</p>
          </Link>
        )
        })}
        USER
      </nav>
      FOOTER
    </section>
  )
}