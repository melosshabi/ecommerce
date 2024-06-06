"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Loader from '@/app/components/Loader'
import { useRouter } from 'next/navigation'

export default function UserOrders() {

  const router = useRouter()
  const [ordersList, setOrdersList] = useState<Array<OrderData>>([])
  const [productsData, setProducstData] = useState<Array<Product>>([])
  const [reqPending, setReqPending] = useState<boolean>(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchOrders(){
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {signal:controller.signal})
        const data = await res.json()
        console.log(data)
        if(data.errCode === "unauthenticated"){
          alert("You need to sign in")
          router.push('/api/auth/signin')
          return
        }
        setOrdersList(prev => [...prev, ...data.userOrders])
        setProducstData(prev => [...prev, ...data.products])
        setReqPending(false)
    }
    fetchOrders()

    return () => controller.abort()
  },[])
  return (
    <div className={`orders-list ${ !ordersList.length ? "empty-orders-list" : ""}`}>
      <Loader displayLoader={reqPending}/>
      {
        !reqPending && !ordersList.length && <h2>You have not placed any orders yet</h2>
      }
      {ordersList?.map((order, index) => {
        return (
          // <Link href={`/userProfile/userOrders/orderDetails?orderId=${order._id}&productDocId=${order.productDocId}`} className='order-summary' key={index}>
          <div className="order-summary" key={index}>
              <div className="order-product-image-wrapper">
                <Image className="order-product-image" src={productsData[index].pictures[0] as string} alt="Product Image" width={100} height={100}/>
              </div>
              <div className="order-details">
                {/* <p className='order-id-link' style={{fontWeight:"bold", marginBottom:5}}>Order ID: #{order._id}</p> */}
                <p>{productsData[index].productName}</p>
                <p>Quantity: {order.desiredQuantity}</p>
                <p>Total Price: {order.totalPrice}€</p>
              </div>
          </div>
          // </Link>
        )
      })}
    </div>
  )
}
