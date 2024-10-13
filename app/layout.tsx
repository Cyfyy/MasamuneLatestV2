import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/Provider/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Masamune - Axie Infinity Origins Tracker',
  description: 'Track your Axie Infinity Origins progress with Masamune',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  )
}