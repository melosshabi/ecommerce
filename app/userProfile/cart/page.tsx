"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import CartList from '@/app/components/CartList'

export default function Cart() {
  
  const session = useSession()
  const [cartList, setCartList] = useState<CartObject[]>([])
  useEffect(() => {
    if(session.status === 'unauthenticated'){
      let localCart: CartObject[] | null = []
      if (typeof window !== 'undefined') localCart = JSON.parse(window?.localStorage.getItem('localCart') as string)
      if(localCart) setCartList([...localCart])
    }else if(session.status === 'authenticated'){
      setCartList([...session.data.user.cart])
    }
  },[session])

  return (
      <CartList productsArray={cartList.length > 0 ? cartList : []}/>
  )
}
