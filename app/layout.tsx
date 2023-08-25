import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import './styles/app.css'

export const metadata: Metadata = {
  title: 'Ecommerce',
  description: 'Ecommerce Project',
  icons:{
    icon:'./favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  )
}
