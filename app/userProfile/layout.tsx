"use client"
import React from 'react'
import ProfilePageSidebar from '../components/ProfilePageSidebar'
import { usePathname } from 'next/navigation'
import '../styles/userProfile.css'

export default function UserProfileLayout({children}: {children: React.ReactNode}) {
  const path = usePathname()
  const splittedPath = path.split('/')
  return (
    <div className='profile-page'>
        <div className="profile-page-sidebar-details-wrapper">
          <ProfilePageSidebar activePage={splittedPath[2] === 'account' ? 'account' : 
            splittedPath[2] === 'cart' ? 'cart' : 
            splittedPath[2] === 'wishlist' ? 'wishlist' : 
            splittedPath[2] === 'products' ? 'products' : 'orders'}/>
            {
              children
            }
        </div>
    </div>
  )
}
