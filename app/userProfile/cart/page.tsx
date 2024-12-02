"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { removeFromCart, parseMonth, placeOrder } from '@/lib/lib'
import plus from '../../images/plus.svg'
import minus from '../../images/minus.svg'
import { useSession } from 'next-auth/react'
import Loader from '../../components/Loader'
import { useRouter } from 'next/navigation'

export default function Cart() {

  // The array that will hold the products data fetched from the database
  const [cartItems, setCartItems] = useState<Array<CartProduct>>([])
  const [reqPending, setReqPending] = useState<boolean>(true)
  const session = useSession()
  const router = useRouter()
  useEffect(() =>{
    const controller = new AbortController()
    async function getCartItems(){
      if(session.status === 'authenticated'){
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editCart`, {signal:controller.signal})
        const data = await res.json()
        setCartItems([...data.cartProducts])
        setReqPending(false)
      }else if(session.status === 'unauthenticated'){
        const localCart = JSON.parse(localStorage.getItem("localCart") as string)
        const productPromises: Promise<Response>[] = []
        if(localCart){
          localCart.forEach((item:LocalCartObject) => {
              const productPromise = fetch(`${process.env.NEXT_PUBLIC_URL}/api/productDetails?_id=${item.productDocId}&dateAdded=${item.dateAdded}&desiredQuantity=${item.desiredQuantity}`)
              productPromises.push(productPromise)
          })
          const products = await Promise.all(productPromises)
          const cart:CartProduct[] = []
          products.forEach(async (product, index) => {
            const productData = await product.json()
            cart.push(productData)
            if(index === products.length - 1){
              setCartItems([...cart])
            }
          })
        }
        setReqPending(false)
      }
    }
    getCartItems()

    return () => controller.abort()
  }, [session])

  async function editCart(userDocId:string | undefined, productDocId:string){
    const tempCart = [...cartItems]
    const newCart = tempCart.filter(product => product._id !== productDocId)
    setCartItems([...newCart])
    await removeFromCart(userDocId, productDocId)
    session.update()
  }
  enum quantityActions {
    inc = 'increment',
    dec = 'decrement'
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
    if(session.status === 'authenticated'){
      const timeout = setTimeout(async () => {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateCartQuantity`, {
          method:'PATCH',
          body:JSON.stringify({productDocId, newQuantity})
        })
      }, 1000)
      setQuantityTimeout(timeout)
    }else if(session.status === 'unauthenticated'){
      let localCart: LocalCartObject[] = []
      if (typeof window !== 'undefined') localCart = JSON.parse(localStorage.getItem('localCart') as string)
      if(action === quantityActions.inc){
        localCart.forEach(product => {
          if(product.productDocId === productDocId){
            product.desiredQuantity += 1
          }
        })
      }else if(action === quantityActions.dec){
        localCart.forEach(product => {
          if(product.productDocId === productDocId){
            product.desiredQuantity -= 1
          }
        })
      }
      if (typeof window !== 'undefined') window?.localStorage.setItem('localCart', JSON.stringify(localCart))
    }
  }
  return (
    <div className={`w-[95dvw] h-[90dvh] overflow-y-scroll m-auto mb-4 rounded-lg p-2 shadow-[0_0_5px_black] sm:w-[75dvw] sm:p-8 lg:h-[80dvh] lg:w-[50dvw] lg:m-0 xl:w-[70dvw] ${cartItems.length === 0 ? 'flex justify-center items-center' : ''}`}>
      <Loader displayLoader={reqPending}/>
      {cartItems.length === 0 && !reqPending && <p className='font-medium text-[2em]'>Your cart is empty</p>}
      {
        cartItems.map((item, index) =>  {
        const dateAddedToCart = new Date(item.dateAdded as Date)
        const year = dateAddedToCart.getFullYear()
        const month = parseMonth(dateAddedToCart.getMonth())
        const day = dateAddedToCart.getDate()
        const hours = dateAddedToCart.getHours()
        const minutes = dateAddedToCart.getMinutes()
          
        return (
          <div className="flex flex-col my-2 border-b border-black py-2 xl:flex-row xl:justify-around" key={index}>
            <div className="flex justify-center items-start h-fit">
              {/* <Image className="w-[170px]" src={session.status !== "loading" && session.status === 'authenticated' ? item.productImage as string : item.pictures[0].toString()} width={200} height={200} alt="Cart item image"/> */}
              {session.status === 'authenticated' && <Image className="w-[170px]" src={item.productImage as string} width={200} height={200} alt="Cart item image"/>}
              {session.status === 'unauthenticated' && <Image className="w-[170px]" src={item.pictures[0]} width={200} height={200} alt="Cart item image"/>}
            </div>

            <div className='text-center'>
              <a href={`/productDetails?_id=${item._id}`} className="cart-item-details">
                <p>{item.productName}</p>
                <p>{item.brandName}</p>
                <p>{item.productPrice}€</p>
              </a>
            
            <div className="flex justify-between my-8 xl:w-[40dvw]">
              <button className="p-2 rounded-md mx-4 transition-all duration-200 hover:bg-transparentBlack" onClick={() => editCart(session.status === 'authenticated' ? session.data?.user.userDocId : undefined, item._id)}>
                <svg className="w-6 h-6"  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                </svg>
              </button>
              <div className='w-[50%] flex items-center justify-between'>
                <button className='quantity-btns' onClick={() => updateQuantity(item._id, quantityActions.dec, item.quantity)}>
                  <Image className='w-[25px]' src={minus} width={50} height={50} alt="Minus icon"/>
                </button>
                <input type="number" className={`quantity-input input-${item._id} w-[10dvw] border-b border-black text-center transition-all duration-200 focus:border-orange`} style={{outline:'none'}} value={item.desiredQuantity} readOnly/>
                
                <button className='quantity-btns' onClick={() => updateQuantity(item._id, quantityActions.inc, item.quantity)}>
                  <Image className='w-[25px]' src={plus} width={50} height={50} alt="Plus icon"/>
                </button>
              </div>
            </div>
              <span className='date-added-to-cart'>{`${day} ${month} ${year} ${hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`}</span>
            </div>
          </div>
          )}
        )
      }
      {cartItems.length > 0 && !reqPending && 
        <button onClick={async () => {
          const stripePaymentUrl = await placeOrder([...cartItems], true)
          router.push(stripePaymentUrl)
        }} className="block text-[1.2em] bg-orange rounded-lg text-white m-auto py-2 px-4 transition-all duration-200 hover:bg-darkerOrange">Place Order</button>
      }
    </div>
  )
}