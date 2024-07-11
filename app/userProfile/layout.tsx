"use client"
import React from 'react'
import ProfilePageSidebar from '../components/ProfilePageSidebar'
import { usePathname } from 'next/navigation'
import '../styles/userProfile.css'

export default function UserProfileLayout({children}: {children: React.ReactNode}) {
  const path = usePathname()
  const splitPath = path.split('/')

  return (
    <div className='profile-page'>
        <div className="profile-page-sidebar-details-wrapper">
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
    </div>
  )
}
