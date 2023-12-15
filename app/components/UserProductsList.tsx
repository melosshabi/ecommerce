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
        const res = await fetch('http://localhost:3000/api/getUserProducts', {signal:controller.signal})
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

    await fetch("http://localhost:3000/api/unlistProduct", {
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
      await fetch('http://localhost:3000/api/updateProductQuantity', {
        method:"PATCH",
        body:JSON.stringify({productDocId, newQuantity})
      })
    }, 1000)
    setQuantityTimeout(timeout)
  }
  return (
    <div className={`user-products-list ${reqPending ? 'empty-user-products-list' : ""}`}>
      <Loader displayLoader={reqPending}/>
        {
          userProducts.map((product, index) => {
            const datePosted = new Date(product.datePosted)
            const year = datePosted.getFullYear()
            const month = parseMonth(datePosted.getMonth())
            const day = datePosted.getDate()
            const hours = datePosted.getHours()
            const minutes = datePosted.getMinutes()

            return (
              <div className="user-product" key={index}>
                {/* Product Image */}
                <div className="user-product-image-wrapper">
                  <Image className="user-product-image" src={product.pictures[0] as string} width={200} height={200} alt="Image of the product"/>
                </div>

                <div className="user-product-details-wrapper">
                  <a href={`/productDetails?_id=${product._id}`} className='user-product-details'>
                    <p>{product.productName}</p>
                    <p>{product.brandName}</p>
                    <p>{product.productPrice}€</p>
                  </a>
                </div>

                <div className="user-product-options">
                  <p className='available-quantity-p'>Available Quantity</p>
                  <div className="user-product-options-btns">
                    <button className="user-product-btns reduce-quantity-btn" onClick={() => updateAvailQuantity(quantityActions.dec, product._id, product.quantity)}>
                      <Image className='quantity-icons' src={minus} width={50} height={50} alt="Minus icon"/>
                    </button>
                    
                    <input value={product.quantity} className={`quantity-input input-${product._id}`} readOnly/>

                    <button className="user-product-btns increase quantity-btn" onClick={() => updateAvailQuantity(quantityActions.inc, product._id, product.quantity)}>
                      <Image className='quantity-icons' src={plus} width={50} height={50} alt="Plus icon"/>
                    </button>
                  </div>
                </div>

                  <button onClick={() => unlistProduct(index, product._id)} className='user-product-btns user-product-remove-btn' title='Unlist product'>
                    <svg className="wishlist-btns-icons" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path xlinkTitle='Unlist Product' d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                    </svg>
                  </button>

                <span className='date-posted'>Listed: {year} {month} {day} {hours}:{minutes}</span>
              </div>
            )
          })
        }
    </div>
  )
}
