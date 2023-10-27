import parseMonth from '@/lib/parseMonth'
import React, { useEffect, useState } from 'react'
import removeFromWishlist from '@/lib/removeFromWishlist'
import Image from 'next/image'
import addToCart from '@/lib/addToCart'

export default function Wishlist({productsArray, userDocId}:WishlistProps) {

    const [wishlistItems, setWishlistItems] = useState<Array<WishlistItem>>([])

    useEffect(() =>{

        const controller = new AbortController()
    
        async function fetchProduct(docId:string, dateAddedToWishlist:string){ 
          try{
            const res = await fetch(`http://localhost:3000/api/productDetails?_id=${docId}`, {signal:controller.signal})
            const data = await res.json()
            setWishlistItems(prev => [...prev, {...data, dateAdded: new Date(dateAddedToWishlist)}])
          }catch(err:any){
            if(err.name === "AbortError") console.log("fetch request aborted")
          }
        }
    
        productsArray.map(async (product) => {
          fetchProduct(product.productDocId, product.dateAdded)
        })
        return () => controller.abort()
      }, [])
    
  return (
    <div className={`wishlist ${wishlistItems.length === 0 ? 'empty-wishlist' : ''}`}>
    
    {
        wishlistItems.length === 0 && <p>Your wishlist is empty</p>
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
            <div className="wishlist-item" key={index}>
                <div className="wishlist-item-image-wrapper">
                <Image className="wishlist-item-image" src={item.pictures[0] as string} width={200} height={200} alt="Wishlist item image"/>
            </div>

            <div className='wishlist-item-details-wrapper'>
                <a href={`/productDetails?_id=${item._id}`} className="wishlist-item-details">
                    <p>{item.productName}</p>
                    <p>{item.brandName}</p>
                    <p>{item.productPrice}€</p>
                </a>

                <div className="wishlist-item-options">
                    <button className="wishlist-btns add-to-cart-btn" title="Add to cart" onClick={() => addToCart(userDocId, item._id, 1, false)}>
                        <svg className="wishlist-btns-icons" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                        </svg>
                    </button>
                    <button className='wishlist-btns remove-btn' title="Remove from wishlist" onClick={() => removeFromWishlist(userDocId, item._id)}>
                        <svg className="wishlist-btns-icons" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
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