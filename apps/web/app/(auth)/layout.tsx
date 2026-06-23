import Image from "next/image"
import ColorBends from '@/components/ui/ColorBends';
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center font-(family-name:--font-inter) bg-[#020617] overflow-hidden">
      {/* background motion effect */}
      <div className="pointer-events-none absolute inset-0 w-full h-full z-0">
        <ColorBends
          rotation={80}
          speed={0.2}
          colors={["#5227FF","#e45be0","#a13175"]}
          transparent
          autoRotate={0}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.3}
          parallax={0.5}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
        />
      </div>
      {/* Content */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8">
        {children}
        
      </div>
    </main>
  )
}
