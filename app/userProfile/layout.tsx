"use client"
import React from 'react'
import ProfilePageSidebar from '../components/ProfilePageSidebar'
import { usePathname } from 'next/navigation'

export default function UserProfileLayout({children}: {children: React.ReactNode}) {
  const path = usePathname()
  const splitPath = path.split('/')

  return (
    // <div className='md:mt-[10dvh]'>
        <div className=" mt-[10dvh] h-[90dvh] lg:flex lg:justify-around lg:items-center">
          <ProfilePageSidebar activePage={splitPath[2] === 'account' ? 'account' : 
            splitPath[2] === 'cart' ? 'cart' : 
            splitPath[2] === 'wishlist' ? 'wishlist' : 
            splitPath[2] === 'userProducts' ? 'userProducts' : 'userOrders'}
            // hideSidebar={splitPath[3] === 'orderDetails'}
            />
            {
              children
            }
        </div>
    // </div>
  )
}