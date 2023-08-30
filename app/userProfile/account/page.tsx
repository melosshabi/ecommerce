"use client"
import React, { useState } from 'react'
import UserInfo from '../../components/UserInfo'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import checkmark from '../../images/checkmark.svg'
import '../../styles/userProfile.css'
import { usePathname, useRouter } from 'next/navigation'
import ProfilePageSidebar from '@/app/components/ProfilePageSidebar'

export default function UserProfile() {

    console.log(usePathname())
    const session = useSession()

  return (
    <div className='profile-page'>
        <div className="profile-page-sidebar-details-wrapper">
            <ProfilePageSidebar/>
            {/* Account Information */}
            {/* @ts-ignore */}
            {session.status === 'authenticated' &&
                // @ts-ignore
                <UserInfo userId={session.data?.user?.userId} username={session.data?.user?.name as string} email={session.data?.user?.email as string} profilePictureUrl={session.data.user?.image as string} />
            }
        </div>
        <div className="account-updated-alert">
        <Image src={checkmark} className="checkmark-icon" alt="Green checkmark icon"/><p>Account Updated Sucessfully</p>
        </div>
    </div>
  )
}
