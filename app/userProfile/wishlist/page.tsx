"use client"
import {parseMonth, removeFromWishlist, addToCart} from '@/lib/lib'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Loader from '../../components/Loader'
import { useSession } from 'next-auth/react'

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<Array<WishlistItem>>([])
    const [reqPending, setReqPending] = useState<boolean>(true)
    const session = useSession()
    useEffect(() =>{
        const controller = new AbortController()
        async function getWishlist(){
            if(session.status === 'authenticated'){
              const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist`, {signal:controller.signal})
              const data = await res.json()
              setWishlistItems([...data.wishlistItems])
              setReqPending(false)
            }else if(session.status === 'unauthenticated'){
              const localWishlist = JSON.parse(localStorage.getItem("localWishList") as string)
              const productPromises: Promise<Response>[] = []
              if(localWishlist){
                localWishlist.forEach((item:LocalWishlistObject) => {
                    const productPromise = fetch(`${process.env.NEXT_PUBLIC_URL}/api/productDetails?_id=${item.productDocId}&dateAdded=${item.dateAdded}`)
                    productPromises.push(productPromise)
                })
                const products = await Promise.all(productPromises)
                const wishlist:WishlistItem[] = []
                products.forEach(async (product, index) => {
                  const productData = await product.json()
                  wishlist.push(productData)
                  if(index === products.length - 1){
                    setWishlistItems([...wishlist])
                  }
                })
                setReqPending(false)
              }
            }
        }
        getWishlist()
        return () => controller.abort()
      }, [session])
    
    async function editWishlist(userDocId:string | undefined, productDocId:string){
      const tempWishlist = [...wishlistItems]
      const newWishlist = tempWishlist.filter(product => product._id !== productDocId)
      setWishlistItems([...newWishlist])
      await removeFromWishlist(userDocId, productDocId)
    }
  return (
    <div className={`w-[95dvw] h-[90dvh] overflow-y-scroll m-auto mb-4 rounded-lg p-2 shadow-[0_0_5px_black] sm:w-[75dvw] sm:p-8 lg:h-[80dvh] lg:w-[50dvw] lg:m-0 xl:w-[70dvw] ${wishlistItems.length === 0 ? 'flex justify-center items-center' : ''}`}>
    <Loader displayLoader={reqPending}/>
    {
        !reqPending && wishlistItems.length === 0 && <p className='text-[1.5em] font-medium'>Your wishlist is empty</p>
    }
    {
        wishlistItems.map((item, index) =>  {
        const dateAdded = new Date(item.dateAdded)
        const year = dateAdded.getFullYear()
        const month = parseMonth(dateAdded.getMonth())
        const day = dateAdded.getDate()
        const hours = dateAdded.getHours()
        const minutes = dateAdded.getMinutes()

        return (
            <div className="flex flex-col items-center my-4 py-4 border-b border-black md:flex-row md:justify-around lg:justify-start" key={index}>
                <div >
                <Image className="" src={session.status === "authenticated" ?  item.productImage as string : item.pictures[0]} width={200} height={200} alt="Wishlist item image"/>
            </div>

            <div className='text-center lg:m-auto'>
                <a href={`/productDetails?_id=${item._id}`}>
                    <p>{item.productName}</p>
                    <p>{item.brandName}</p>
                    <p>{item.productPrice}€</p>
                </a>

                <div className="flex justify-center my-6">
                    <button className="p-2 rounded-md mx-4 transition-all duration-200 hover:bg-transparentBlack" title="Add to cart" onClick={async () => {
                          await addToCart(session.status === 'authenticated', item._id, 1, false)
                      }}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                        </svg>
                    </button>
                    <button className="p-2 rounded-md mx-4 transition-all duration-200 hover:bg-transparentBlack" title="Remove from wishlist" onClick={() => editWishlist(session.status === "authenticated" ? session.data.user.userDocId : undefined, item._id)}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                        </svg>
                    </button>
                </div>

                <span className='date-added-to-wishlist'>{`${day} ${month} ${year} ${hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`}</span>
            </div>

            </div>
          )}
        )
      }
    </div>
  )
}