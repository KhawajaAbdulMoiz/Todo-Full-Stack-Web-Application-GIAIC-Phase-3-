import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from 'react-hot-toast'
import { Inter, Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'TaskFlow - Collaborative Task Management',
  description: 'A secure, collaborative todo application for teams',
}
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
<body className="antialiased">
  <AuthProvider>{children}</AuthProvider>
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#0f172a',
      },
    }}
  />
</body>
    </html>
  )
}
