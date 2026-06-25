import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getLoggedInUser } from '@/lib/actions/cached'
import Particles from '@/components/Particles'

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  const loggedIn = await getLoggedInUser()

  if (!loggedIn) {
    redirect('/sign-in')
  }

  return (
    <main className="relative flex h-screen w-full font-(family-name:--font-inter) bg-[#020617] bg-[radial-gradient(circle_at_50%_30%,#1e293b_0%,#0f172a_70%,#020617_100%)] overflow-hidden">
      {/* Background Particles behind all layout panels */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <Particles
          particleColors={["#6366f1", "#4f46e5", "#10b981", "#06b6d4"]}
          particleCount={250}
          particleSpread={15}
          speed={0.12}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 flex h-screen w-full">
        <Sidebar user={loggedIn} />
        <div className='flex h-full min-w-0 flex-1 flex-col relative z-10'>
          <div className='root-layout relative z-10'>
            <Image src='/icons/logo.svg' width={30} height={30} alt='menu icon' />
            <div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}

