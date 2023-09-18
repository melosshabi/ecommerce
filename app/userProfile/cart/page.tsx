"use client"
import React, {useEffect, useState} from 'react'
import { useSession } from 'next-auth/react'
import CartList from '@/app/components/CartList'
import { useRouter } from 'next/navigation'

export default function Cart() {
  
  const session = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if(session.status === 'unauthenticated') router.push('/api/auth/signin')
  },[session])

  return (
    <>
      {
        session.status === 'authenticated' && 
          <CartList productsArray={session.data.user.cart}/>
      }
    </>
  )
}
