import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";
import { Inter, DM_Sans, JetBrains_Mono } from "next/font/google"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata = {
  title: "KoshFlow",
  description: "A modern, intuitive, and powerful budgeting app built with Next.js and Tailwind CSS.",
  icons: {
    icon: 'icons/logo.svg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", inter.variable, dmSans.variable, jetBrainsMono.variable)}
    >
      <body className="min-h-screen bg-[#020617] text-slate-100">
        {children}
      </body>
    </html>
  )
}
