"use client"
import React, { useEffect } from 'react'
import UserInfo from '../../components/UserInfo'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import checkmark from '../../images/checkmark.svg'
import {useRouter} from 'next/navigation'

export default function UserProfile() {

    const session = useSession()
    const router = useRouter()
    useEffect(() => {
      if(session.status === 'unauthenticated') router.push('/api/auth/signin')
    }, [session])
  
  return (
    <>
      {/* @ts-ignore */}
      {session.status === 'authenticated' &&
          // @ts-ignore
          <UserInfo userId={session.data?.user?.userId} username={session.data?.user?.name as string} email={session.data?.user?.email as string} profilePictureUrl={session.data.user?.image as string} />
      }
      <div className="acc-updated-alert w-[85dvw] flex justify-center items-center absolute left-[7.5dvw] bottom-[-10dvh] bg-white rounded-lg p-2 shadow-[0_0_5px_black] transition-all duration-300">
      <Image src={checkmark} className="w-8" alt="Green checkmark icon"/><p className='ml-2'>Account Updated Sucessfully</p>
      </div>
    </>
  )
}
