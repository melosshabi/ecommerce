"use client"
import React, { useEffect } from 'react'
import ProfilePageSidebar from '../components/ProfilePageSidebar'
import { usePathname, useRouter } from 'next/navigation'
import '../styles/userProfile.css'
import { useSession } from 'next-auth/react'

export default function UserProfileLayout({children}: {children: React.ReactNode}) {
  const path = usePathname()
  const splittedPath = path.split('/')
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session.status === 'unauthenticated') router.push('/signin')
  }, [])
  return (
    <div className='profile-page'>
        <div className="profile-page-sidebar-details-wrapper">
          <ProfilePageSidebar activePage={splittedPath[2] === 'account' ? 'account' : 
            splittedPath[2] === 'cart' ? 'cart' : 
            splittedPath[2] === 'wishlist' ? 'wishlist' : 
            splittedPath[2] === 'userProducts' ? 'userProducts' : 'userOrders'}/>
            {
              children
            }
        </div>
    </div>
  )
}