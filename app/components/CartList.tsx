"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import parseMonth from '@/lib/parseMonth'
import plus from '../images/plus.svg'
import minus from '../images/minus.svg'
import { useSession } from 'next-auth/react'
import removeFromCart from '@/lib/removeFromCart'
import Loader from './Loader'

export default function CartList({productsArray} : CartListProps) {

  // The array that will hold the products data fetched from the database
  const [cartItems, setCartItems] = useState<Array<CartProduct>>([])
  const [reqPending, setReqPending] = useState<boolean>(true)
  const session = useSession()

  useEffect(() =>{

    if(!productsArray.length) setReqPending(false)

    const controller = new AbortController()

    async function fetchProduct(docId:string, dateAddedToCart:string, desiredQuantity:number){ 
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productDetails?_id=${docId}`, {signal:controller.signal})
        const data = await res.json()
        setCartItems(prev => [...prev, {...data, desiredQuantity, dateAddedToCart: new Date(dateAddedToCart)}])
        setReqPending(false)
      }catch(err:any){
        if(err.name === "AbortError") console.log("fetch request aborted")
      }
    }
      
    productsArray.map(async (product) => {
      await fetchProduct(product.productDocId, product.dateAdded, product.desiredQuantity)
    })

    return () => controller.abort()
  }, [])

  const quantityActions = {
    inc:'increment',
    dec:'decrement'
  }
  
  const [quantityTimeout, setQuantityTimeout] = useState<NodeJS.Timeout | null>(null)
  // Function that updates the desired quantity 
  async function updateQuantity(productDocId:string, action:string, productStock:number){

    if(quantityTimeout) {
      clearTimeout(quantityTimeout)
      setQuantityTimeout(null)
    }

    const input = document.querySelector(`.input-${productDocId}`) as HTMLInputElement
    let newQuantity: number | null = null

    if(action === quantityActions.inc){  
      const newValue = parseInt(input.value) + 1
      if(newValue > productStock){
        newQuantity = productStock
        input.value = productStock.toString()
      }else {
        input.value = newValue.toString()
        newQuantity = newValue
      }
      
    }else if(action === quantityActions.dec){
      const newValue = parseInt(input.value) - 1
      if(newValue < 1 ) {
        newQuantity = 1
        input.value = "1"
        return
      }else {
        input.value = newValue.toString()
        newQuantity = newValue
      }
    }

    const timeout = setTimeout(async () => {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateCartQuantity`, {
        method:'PATCH',
        body:JSON.stringify({productDocId, newQuantity})
      })
    }, 1000)
    setQuantityTimeout(timeout)
  }

  return (
    <div className={`cart-list ${cartItems.length === 0 ? 'empty-cart-list' : ''}`}>
      <Loader displayLoader={reqPending}/>
      {
       cartItems.map((item, index) =>  {

        const dateAddedToCart = new Date(item.dateAddedToCart)
        const year = dateAddedToCart.getFullYear()
        const month = parseMonth(dateAddedToCart.getMonth())
        const day = dateAddedToCart.getDate()
        const hours = dateAddedToCart.getHours()
        const minutes = dateAddedToCart.getMinutes()

        return (
            <div className="cart-item" key={index}>
              <div className="cart-item-image-wrapper">
              <Image className="cart-item-image" src={item.pictures[0] as string} width={200} height={200} alt="Cart item image"/>
            </div>

            <div className='cart-item-details-wrapper'>
              <a href={`/productDetails?_id=${item._id}`} className="cart-item-details">
                <p>{item.productName}</p>
                <p>{item.brandName}</p>
                <p>{item.productPrice}€</p>
              </a>
            
              <div className="quantity-wrapper">
              <button className="remove-from-cart-btn" onClick={() => removeFromCart(session.data?.user.userDocId as string, item._id)}>
                <svg className="remove-from-cart-btn-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                </svg>
              </button>

                <button className='quantity-btns' onClick={() => updateQuantity(item._id, quantityActions.inc, item.quantity)}>
                  <Image className='quantity-icons' src={plus} width={50} height={50} alt="Plus icon"/>
                </button>
                <input type="number" className={`quantity-input input-${item._id}`} value={item.desiredQuantity}/>
                <button className='quantity-btns' onClick={() => updateQuantity(item._id, quantityActions.dec, item.quantity)}>
                  <Image className='quantity-icons' src={minus} width={50} height={50} alt="Minus icon"/>
                </button>
              </div>
              <span className='date-added-to-cart'>{`${day} ${month} ${year} ${hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`}</span>
            </div>

            </div>
          )}
        )
      }
    </div>
  )
}
