"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import getProductById from '@/lib/getProductById'

export default function UserOrders() {

  const session = useSession()
  const router = useRouter()
  const [ordersList, setOrdersList] = useState<Array<OrderData>>([])
  const [productsData, setProducstData] = useState<Array<Product>>([])
  const [reqPending, setReqPending] = useState<boolean>(true)

  useEffect(() => {
    const controller = new AbortController()
    if(session.status === 'authenticated'){
      async function fetchOrders(){
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {signal:controller.signal})
          const data = await res.json()
          console.log("Orders: ", data)
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
    }else{
      const localOrders: OrderData[] = JSON.parse(localStorage.getItem("localOrders") as string)
      if(localOrders){ 
        setOrdersList([...localOrders])
        const orderPromises = localOrders.map(async order => {
          return getProductById(order.productDocId)
        });
        (async function() {
          const orderPromisesData: Product[] = await Promise.all(orderPromises)
          setProducstData([...orderPromisesData])
          setReqPending(false)
        })();
    }    
  }
  return () => controller.abort()
},[])

  return (
    <div className={`orders-list ${ !ordersList.length ? "empty-orders-list" : ""} ${reqPending ? 'loading-orders-list' : ""}`}>
      <Loader displayLoader={reqPending}/>
      {
        !reqPending && !ordersList.length && <h2>You have not placed any orders yet</h2>
      }

      {
        // Authenticated Users
        session.status === "authenticated" ?
        ordersList?.map((order, index) => {
          return (
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
          )
      }):
      // Unauthenticated users
      productsData.map((product, index) => {
        return (
          <div className="order-summary" key={index}>
              <div className="order-product-image-wrapper">
                <Image className="order-product-image" src={product.pictures[0] as string} alt="Product Image" width={100} height={100}/>
              </div>
              <div className="order-details">
                <p>{productsData[index].productName}</p>
                <p>Quantity: {ordersList[index].desiredQuantity}</p>
                <p>Total Price: {ordersList[index].totalPrice}€</p>
              </div>
          </div>
        )
      })
      }
    </div>
  )
}
