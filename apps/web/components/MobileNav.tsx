'use client'
import react from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Footer from './Footer'                       
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
import ShinyText from './ShinyText'
import PlaidLink from './PlaidLink'

export default function MobileNav({user} : MobileNavProps) {
  const pathName = usePathname()
  return(
    <section className='w-full max-w-66'>
      <Sheet>
        <SheetTrigger>
          <Image src='/icons/hamburger.svg' width={30} height={30} alt='menu' className='cursor-pointer brightness-0 invert'/>
        </SheetTrigger>
          <SheetContent side='left' className='border-none bg-slate-950 pl-2'>
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
            <h1 className='text-26 font-[family-name:var(--font-dm-sans)] font-bold text-white flex items-center'>
              <ShinyText text="KoshFlow" speed={3} color="#ffffff" shineColor="#818cf8" />
            </h1>
            </Link>
            <div className='mobilenav-sheet'>
              <SheetClose asChild>
                <nav className='flex flex-col h-full gap-4 pt-8 text-slate-100'>
                  {sidebarLinks.map((item) => {
                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
                    return(
                      <SheetClose asChild key={item.route}>
                        <Link href={item.route} key={item.label}
                          className={cn('mobilenav-sheet_close w-full transition-all duration-200', {
                            'bg-indigo-600/15 border border-indigo-500/20': isActive,
                            'hover:bg-white/5': !isActive,
                          })}
                        >
                          <Image src={item.imgURL} alt={item.label} width={20} height={20}
                            className={cn('transition-all duration-200', {
                              'brightness-[3] invert-0': isActive,
                              'opacity-60': !isActive,
                            })}
                          />
                          <p className={cn(
                            'text-16 font-semibold transition-colors duration-200', {
                            'text-indigo-300': isActive,
                            'text-slate-400': !isActive,
                          })} 
                          >{item.label}</p>
                        </Link>
                      </SheetClose>
                    )
                  })}
                </nav>
              </SheetClose>
              <div className='px-4 py-2 mt-4'>
                <SheetClose asChild>
                  <PlaidLink user={user} />
                </SheetClose>
              </div>
              <Footer user={user} type="mobile"/>
            </div>
        
          </SheetContent>
      </Sheet>
    </section>
  )
}
 