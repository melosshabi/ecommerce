"use client"
import React, { useEffect } from 'react'
import UserInfo from '../../components/UserInfo'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'

export default function UserProfile() {

    const session = useSession()
    const router = useRouter()
    useEffect(() => {
      if(session.status === 'unauthenticated') router.push('/api/auth/signin')
    }, [session])
  
  return (
    <div>
      {/* @ts-ignore */}
      {session.status === 'authenticated' &&
          // @ts-ignore
          <UserInfo userId={session.data?.user?.userId} username={session.data?.user?.name as string} email={session.data?.user?.email as string} profilePictureUrl={session.data.user?.image as string} />
      }
      
    </div>
  )
}
