import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getLoggedInUser } from '@/lib/actions/cached'

export default async function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  const loggedIn = await getLoggedInUser()

  if (!loggedIn) {
    redirect('/sign-in')
  }

  return (
    <main className="flex h-screen w-full font-(family-name:--font-inter) bg-[#020617] bg-[radial-gradient(circle_at_50%_30%,#1e293b_0%,#0f172a_70%,#020617_100%)]">
      <Sidebar user={loggedIn} />
      <div className='flex size-full flex-col'>
        <div className='root-layout'>
          <Image src='/icons/logo.svg' width={30} height={30} alt='menu icon' />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
      {children}
      </div>
    </main>
  )
}

