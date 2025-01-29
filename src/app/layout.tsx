import "./globals.css"
import { Orbitron } from "next/font/google"
import { ThemeProvider } from "next-themes"
import type React from "react"

const orbitron = Orbitron({ subsets: ["latin"] })

export const metadata = {
  title: "Cyberpunk Frontend",
  description: "A futuristic cyberpunk-inspired frontend",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.className} bg-cyber-black text-neon-blue`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

