"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Wishlist from '@/app/components/Wishlist'

export default function WishlistPage() {
  const session = useSession()
  const [wishlist, setWishlist] = useState<WishlistObject[]>([])
  useEffect(() => {
    if(session.status === 'unauthenticated'){
      let localWishlist: WishlistObject[] | null = []
      if (typeof window !== 'undefined') localWishlist = JSON.parse(window?.localStorage.getItem('localWishList') as string)
      if(localWishlist) setWishlist([...localWishlist])
    }else if(session.status === 'authenticated'){
      setWishlist([...session.data.user.wishlist])
    }
  },[session])

  return (
        <Wishlist productsArray={wishlist} userDocId={session.status === "authenticated" ? session.data.user.userDocId : undefined}/>
  )
}
