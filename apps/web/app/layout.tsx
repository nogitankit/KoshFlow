import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";
import {Inter, IBM_Plex_Serif} from "next/font/google"

const inter = Inter({
  subsets:['latin'],
  variable:'--font-inter'
})
const ibmPlexSerif = IBM_Plex_Serif({
  subsets:['latin'],
  variable:'--font-ibm-plex-serif',
  weight:['400', '500', '600', '700']
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
      className={cn("antialiased", inter.variable, ibmPlexSerif.variable)}
    >
      <body>
        {children}
      </body>
    </html>
  )
}
