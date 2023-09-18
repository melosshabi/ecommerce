import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import parseMonth from '@/lib/parseMonth'
import plus from '../images/plus.svg'
import minus from '../images/minus.svg'
import { useSession } from 'next-auth/react'
import removeFromCart from '@/lib/removeFromCart'

export default function CartList({productsArray} : CartListProps) {

  // The array that will hold the products data fetched from the database
  const [cartItems, setCartItems] = useState<Array<CartProduct>>([])
  const session = useSession()
  useEffect(() =>{

    const controller = new AbortController()

    async function fetchProduct(docId:string, dateAddedToCart:string, desiredQuantity:number){ 
      try{
        const res = await fetch(`http://localhost:3000/api/productDetails?_id=${docId}`, {signal:controller.signal})
        const data = await res.json()
        setCartItems(prev => [...prev, {...data, desiredQuantity, dateAddedToCart: new Date(dateAddedToCart)}])
      }catch(err:any){
        if(err.name === "AbortError") console.log("fetch request aborted")
      }
    }

    for(let i = 0; i < productsArray.length; i++){
      fetchProduct(productsArray[i].productDocId, productsArray[i].dateAdded, productsArray[i].desiredQuantity)
    }
    return () => controller.abort()
  }, [])


  const quantityActions = {
    inc:'increment',
    dec:'decrement'
  }
  
  const [quantityTimeout, setQuantityTimeout] = useState<NodeJS.Timeout | null>(null)
  // Function that updates the desired quantity 
  async function updateQuantity(userId:string, productDocId:string, action:string, productStock:number){

    if(quantityTimeout) {
      clearTimeout(quantityTimeout)
      setQuantityTimeout(null)
    }

    const input = document.querySelector(`.input-${productDocId}`) as HTMLInputElement
    // The variable below will hold the new quantity that the user wants, and it will be sent to the updateQuantity route handler
    let newQuantityValue:number | undefined = undefined
    if(action === quantityActions.inc){  
      const newValue = parseInt(input.value) + 1
      if(newValue > productStock) return
      input.value = newValue.toString()
      newQuantityValue = newValue
    }else if(action === quantityActions.dec){
      const newValue = parseInt(input.value) - 1
      if(newValue < 1 ) return
      input.value = newValue.toString()
      newQuantityValue = newValue
    }
    const timeout = setTimeout(async () => {
      const res = await fetch('http://localhost:3000/api/updateCartQuantity', {
        method:'PATCH',
        body:JSON.stringify({userId, productDocId, action, newQuantityValue})
      })
      console.log(await res.json())
    }, 100)
    setQuantityTimeout(timeout)
  }

  return (
    <div className='cart-list'>
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
              <button className="cart-item-btn" onClick={() => removeFromCart(session.data?.user.userId as string, item._id)}>
                <svg className="cart-item-btn-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                </svg>
              </button>

                <button className='quantity-btns' onClick={() => updateQuantity(session.data?.user?.userId as string, item._id, quantityActions.inc, item.quantity)}>
                  <Image className='quantity-icons' src={plus} width={50} height={50} alt="Plus icon"/>
                </button>
                <input type="number" className={`quantity-input input-${item._id}`} value={item.desiredQuantity} readOnly/>
                <button className='quantity-btns' onClick={() => updateQuantity(session.data?.user.userId as string, item._id, quantityActions.dec, item.quantity)}>
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
