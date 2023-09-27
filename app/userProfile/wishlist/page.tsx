"use client"
import Wishlist from '@/app/components/Wishlist'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function WishlistPage() {
  const session = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if(session.status === 'unauthenticated') router.push('/api/auth/signin')
  },[session])

  return (
    session.status === 'authenticated' &&
    <>
      <Wishlist productsArray={session.data?.user.wishlist} userDocId={session.data.user.userDocId}/>
    </>
  )
}
