'use client'
import react from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
export default function MobileNav() {
  const pathName = usePathname()
  return(
    <section className='w-full max-w-66'>
      <Sheet>
        <SheetTrigger>
          <Image src='/icons/hamburger.svg' width={30} height={30} alt='menu' className='cursor-pointer'/>
        </SheetTrigger>
          <SheetContent side='left' className='border-none pl-2'>
            <SheetTitle className="sr-only">
              Navigation Menu
            </SheetTitle>
            <SheetDescription className="sr-only">
              Browse application pages and navigate through KoshFlow.
            </SheetDescription>
            <Link href='/' className='cursor-pointer items-center gap-2 p-4 flex'>
            <Image
              src='/icons/logo.svg'
              width={34}
              height={34}
              alt='logo'
            />
            <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>KoshFlow</h1>
            </Link>
            <div className='mobilenav-sheet'>
              <SheetClose asChild>
                <nav className='flex flex-col h-full gap-6 pt-8 text-white'>
                  {sidebarLinks.map((item) =>{

                  const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
                  // dynamically applying styles using clsx and twMerge
                  return(
                    <SheetClose asChild key={item.route}>
                      <Link href={item.route} key={item.label}
                      className={cn('mobilenav-sheet_close w-full', {
                      'bg-bank-gradient' : isActive
                    })}>
                      <Image src={item.imgURL} alt={item.label} width={20} height={20}
                      className={cn({
                        'brightness-[3] invert-0' : isActive 
                      })}
                      />
                      <p className={cn(
                        'text-16 font-semibold text-black-2',{
                        'text-white': isActive
                      })} 
                      >{item.label}</p>
                    </Link>
                    </SheetClose>
                  )
                  })}
                  USER
                </nav>
              </SheetClose>
              FOOTER
            </div>
        
          </SheetContent>
      </Sheet>
    </section>
  )
} 