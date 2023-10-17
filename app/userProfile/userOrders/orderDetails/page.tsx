"use client"
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import '../../../styles/orderDetails.css'

export default function OrderDetails() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const productDocId = searchParams.get('productDocId')

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

    useEffect(() => {
        async function getOrderDetails(){
            const res = await fetch(`http://localhost:3000/api/orders?singleOrder=true&orderId=${orderId}&productDocId=${productDocId}`)
            const data = await res.json()
            setOrderDetails(data)
        }

        getOrderDetails()
    }, [])
  return (
    <div className='order-details-wrapper'>
        {/* <h2>Order: #{orderDetails?.order.orderId}</h2> */}
        <div className="order-details-product">
            <div className="order-details-product-image-wrapper">
                <Image className='order-details-product-image' width={500} height={500} src={orderDetails?.product.pictures[0] as string} alt="Picture of the product"/>
            </div>

            <div>
                <p><span className='bold'>Product Name:</span> {orderDetails?.product.productName}</p>
                {orderDetails?.product.brandName && <p><span className='bold'>Brand:</span> {orderDetails.product.brandName}</p>}
                <p><span className='bold'>Price:</span> {orderDetails?.product.productPrice}€</p>
                <p><span className="bold">Ordered Quantity:</span> {orderDetails?.order.desiredQuantity}</p>
                <p><span className="bold">Total Price:</span> {orderDetails?.order.orderPrice}€</p>
            </div>
        </div>

        <div className="order-details"></div>
    </div>
  )
}
