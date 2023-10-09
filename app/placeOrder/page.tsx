"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import '../styles/placeOrder.css'

export default function PlaceOrder() {
    const searchParams = useSearchParams()
    const productDocId = searchParams.get('_id')
    const chosenQuantity = searchParams.get('desiredQuantity')
    const router = useRouter()
    const [product, setProduct] = useState<Product | undefined>()

    useEffect(() => {
        (async function fetchProductDetails(){
            const res = await fetch(`http://localhost:3000/api/productDetails?_id=${productDocId}`)
            const data = await res.json()
            if(!data){
                router.push('/')
            }
            setProduct(data)
        }())
    }, [])
    
  return (
    <div className="order-page">
      <h2>Order form for: {product?.productName}</h2>
      <div className='product-payment-form-wrapper'>
        
        <div className="product-wrapper">
          <div className="product-image-wrapper">
            <Image width={200} height={200} src={product?.pictures[0] as string} alt="The product the user wants to buy"/>
          </div>

          <div className="product-details-wrapper">
            <p>Product: {product?.productName}</p>
            {product?.brandName && <p>Brand: {product?.brandName}</p>}
            <p>Price: {product?.productPrice}€</p>
            <p>Quantity: {chosenQuantity}</p>
            <p>Total: {product?.productPrice as number * parseInt(chosenQuantity as string)}€</p>
          </div>
        </div>

        <form className="payment-form">
          
        </form>
      </div>
    </div>
  )
}
