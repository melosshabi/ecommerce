import React from "react";
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import './styles/app.css'
import Provider from './components/Provider'

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
    <html lang="en" className='overflow-x-hidden'>
      <Provider>
        <body className='font-work-sans overflow-x-hidden'>
          <Navbar/>
          {children}
        </body>
      </Provider>
    </html>
  )
}
