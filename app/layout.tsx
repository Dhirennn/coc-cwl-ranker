import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CoC CWL Ranker - Fair Clan War League Bonus Distribution",
  description:
    "Mathematical algorithm for fair Clash of Clans CWL bonus distribution based on performance, participation, and strategic attacking.",
  keywords: "Clash of Clans, CWL, Clan War League, bonus distribution, ranking algorithm",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
