import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HSIBS URL Shortener",
  description: "Pendekkan link panjang jadi link pendek",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Toaster richColors closeButton /> 
        {children}
      </body>
    </html>
  )
}
