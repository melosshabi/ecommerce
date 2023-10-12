"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function UserOrders() {

  const [ordersList, setOrdersList] = useState<Array<orderData>>([])
  const [productsData, setProducstData] = useState<Array<Product>>([])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchOrders(){
      const req = await fetch('http://localhost:3000/api/orders', {signal:controller.signal})
      const response = await req.json()
      console.log(response)
      setOrdersList(prev => [...prev, ...response.userOrders])
      setProducstData(prev => [...prev, ...response.products])
    }
    fetchOrders()

    return () => controller.abort()
  },[])
  return (
    <div className='orders-list'>
      {ordersList?.map((order, index) => {
        return (
          <div className='order-summary' key={index}>
            <div className="order-product-image-wrapper">
              <Image className="order-product-image" src={productsData[index].pictures[0] as string} alt="Product Image" width={100} height={100}/>
            </div>
            <div className="order-details">
              <Link className='order-id-link' href={`/userProfile/userOrders/${order.orderId}`} style={{fontWeight:"bold", marginBottom:5}}>Order ID: #{order.orderId}</Link>
              <p>{productsData[index].productName}</p>
              <p>Quantity: {order.desiredQuantity}</p>
              <p>Total Price: {order.orderPrice}€</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
