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
            <div className="product-details">
                <div className="product-details-image-wrapper">
                    <Image className='product-details-image' width={500} height={500} src={orderDetails?.product.pictures[0] as string} alt="Picture of the product"/>
                </div>

                <div>
                    <p><span className='bold'>Product Name:</span> {orderDetails?.product.productName}</p>
                    {orderDetails?.product.brandName && <p><span className='bold'>Brand:</span> {orderDetails.product.brandName}</p>}
                    <p><span className='bold'>Price:</span> {orderDetails?.product.productPrice}€</p>
                    <p><span className="bold">Ordered Quantity:</span> {orderDetails?.order.desiredQuantity}</p>
                    <p><span className="bold">Total Price:</span> {orderDetails?.order.orderPrice}€</p>
                </div>
            </div>

            <div className="order-details">
                <h2>Order Details</h2>
                <div>
                    <label className='order-details-labels'>Card ending in</label>
                    <input className="order-details-inputs" type="text" disabled value={orderDetails?.order.cardNumber}/>
                </div>

                <div>
                    <label className='order-details-labels'>Billing Address</label>
                    <input className="order-details-inputs" type="text" disabled value={orderDetails?.order.billingAddress}/>

                </div>

                <div>
                <label className='order-details-labels'>Billing Address 2</label>
                    <input className="order-details-inputs" type="text" disabled value={orderDetails?.order.billingAddress2}/>
                </div>
            </div>
        </div>
  )
}
