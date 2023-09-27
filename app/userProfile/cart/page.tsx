"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import CartList from '@/app/components/CartList'

export default function Cart() {
  
  const session = useSession()

  return (
    <>
      {
        session.status === 'authenticated' && 
          <CartList productsArray={session.data.user.cart}/>
      }
    </>
  )
}
