import React, { useEffect, useState } from 'react'
import parseMonth from '@/lib/parseMonth'
import Image from 'next/image'
import plus from '../images/plus.svg'
import minus from '../images/minus.svg'
import Loader from './Loader'

export default function UserProductsList() {

  const [userProducts, setUserProducts] = useState<Array<UserProduct>>([])
  const [reqPending, setReqPending] = useState<boolean>(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUserProducts(){
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getUserProducts`, {signal:controller.signal})
        const data = await res.json()
        setUserProducts(data.products)
        setReqPending(false)
      }catch(err:any){
        if(err.name === 'AbortError') console.log("fetch request aborted")
      }
      
    }
    fetchUserProducts()

    return () => controller.abort()
  } ,[])

  async function unlistProduct(index:number, productDocId:string){
    const tempArr = userProducts
    tempArr.splice(index, 1)
    setUserProducts([...tempArr])

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/unlistProduct`, {
      method:"DELETE",
      body:JSON.stringify({
        productToDeleteId:productDocId
      })
    })
  }

  const quantityActions = {
    inc:'inc',
    dec:'dec'
  }

  const [quantityTimeout, setQuantityTimeout] = useState<NodeJS.Timeout | null>(null)

  // This function updates the available quantity of a product that's for sale
  async function updateAvailQuantity(action:string, productDocId:string, avialableStock:number){

    if(quantityTimeout){
      clearTimeout(quantityTimeout)
      setQuantityTimeout(null)
    }

    const input = document.querySelector(`.input-${productDocId}`) as HTMLInputElement
    // This variable will hold the desired quantity of the product and will be sent to the route handler
    let newQuantity: number | null = null

    if(action === quantityActions.inc){
      const newValue = parseInt(input.value) + 1
      newQuantity = newValue
      input.value = newValue.toString()
      
    }else if(action === quantityActions.dec){
      const newValue = parseInt(input.value) - 1
      if(newValue < 1){
        newQuantity = 1
        input.value = "1"
        return
      }else{
        input.value = newValue.toString()
        newQuantity = newValue
      }
    }

    const timeout = setTimeout(async () => {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateProductQuantity`, {
        method:"PATCH",
        body:JSON.stringify({productDocId, newQuantity})
      })
    }, 1000)
    setQuantityTimeout(timeout)
  }
  return (
    <div className="w-[95dvw] h-[80dvh] overflow-y-scroll m-auto rounded-lg p-2 shadow-[0_0_5px_black] lg:w-[70dvw] lg:m-0">
      <Loader displayLoader={reqPending}/>
        {
          userProducts.map((product, index) => {
            const datePosted = new Date(product.createdAt)
            const year = datePosted.getFullYear()
            const month = parseMonth(datePosted.getMonth())
            const day = datePosted.getDate()
            const hours = datePosted.getHours()
            const minutes = datePosted.getMinutes()

            return (
              <div className="flex flex-col items-center border-b border-black my-4" key={index}>
                {/* Product Image */}
                <div>
                  <Image src={product.pictures[0] as string} width={200} height={200} alt="Image of the product"/>
                </div>

                <div>
                  <a className='text-center my-3' href={`/productDetails?_id=${product._id}`}>
                    <p>{product.productName}</p>
                    <p>{product.brandName}</p>
                    <p>{product.productPrice}€</p>
                  </a>
                </div>

                <div className='my-2'>
                  <p className='text-center'>Available Quantity</p>
                  <div className="flex justify-around my-2">
                    <button className="p-2 rounded-md transition-all duration-200 hover:bg-transparentBlack" onClick={() => updateAvailQuantity(quantityActions.dec, product._id, product.quantity)}>
                      <Image className='w-6 h-6' src={minus} width={50} height={50} alt="Minus icon"/>
                    </button>
                    
                    <input value={product.quantity} className={`w-[15%] border-b border-black text-center transition-all duration-200 focus:border-orange input-${product._id}`} style={{outline:'none'}} readOnly/>

                    <button className="p-2 rounded-md transition-all duration-200 hover:bg-transparentBlack" onClick={() => updateAvailQuantity(quantityActions.inc, product._id, product.quantity)}>
                      <Image className='w-6 h-6' src={plus} width={50} height={50} alt="Plus icon"/>
                    </button>
                  </div>
                </div>

                  {/* <button onClick={() => unlistProduct(index, product._id)} className='user-product-btns user-product-remove-btn' title='Unlist product'>
                    <svg className="wishlist-btns-icons" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path xlinkTitle='Unlist Product' d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                    </svg>
                  </button> */}

                <span className='date-posted'>Listed: {year} {month} {day} {hours}:{minutes}</span>
              </div>
            )
          })
        }
    </div>
  )
}
