"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {getProductById} from '@/lib/lib'
import {parseMonth} from '@/lib/lib'

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
    }else if(session.status === "unauthenticated"){
      let localOrders: OrderData[] = []
      if (typeof window !== 'undefined') localOrders = JSON.parse(localStorage.getItem("localOrders") as string)
      if(localOrders){ 
        setOrdersList([...localOrders])
        const orderPromises = localOrders.map(async order => {
          return getProductById(order.productDocId)
        });
        (async function() {
          const orderPromisesData: Product[] = await Promise.all(orderPromises)
          setProducstData([...orderPromisesData])
        })();
    }
    setReqPending(false)    
  }
  return () => controller.abort()
},[])

  return (
    <div className={`w-[95dvw] h-[80dvh] m-auto p-4 overflow-y-scroll rounded-lg shadow-[0_0_5px_black] lg:w-[70dvw] lg:m-0 ${ !ordersList.length && "flex justify-center items-center"} ${reqPending && 'flex justify-center items-center'}`}>
      {!reqPending && ordersList.length > 0 && <h2 className='mb-4 text-center font-medium text-[1.5em] border-b border-black'>Orders</h2>}
      <Loader displayLoader={reqPending}/>
      {
        !reqPending && ordersList.length === 0 && productsData.length === 0 && <h2 className='text-3xl'>You have not placed any orders yet</h2>
      }
      {
        // Authenticated Users
        session.status === "authenticated" ?
        ordersList?.map((order, index) => {
          const date = new Date(order.createdAt)
          const year = date.getFullYear()
          const month = parseMonth(date.getMonth())
          const day = date.getDate()
          return (
            <div className="flex flex-col items-center border-b border-black p-4 xl:flex-row" key={index}>
                <div>
                  <Image src={productsData[index].pictures[0] as string} alt="Product Image" width={100} height={100}/>
                </div>
                <div className="text-center my-4 xl:text-start xl:ml-6">
                  <p>{productsData[index].productName}</p>
                  <p>Quantity: {order.desiredQuantity}</p>
                  <p>Total Price: {order.totalPrice}€</p>
                  <p>Date: {`${month}-${day}-${year}`}</p>
                </div>
            </div>
          )
      }):
      // Unauthenticated users
      productsData.map((product, index) => {
          const date = new Date(ordersList[index].createdAt)
          const year = date.getFullYear()
          const month = parseMonth(date.getMonth())
          const day = date.getDate()
        return (
          <div className="flex flex-col items-center border-b border-black p-4 xl:flex-row" key={index}>
              <div>
                <Image src={product.pictures[0] as string} alt="Product Image" width={100} height={100}/>
              </div>
              <div className="text-center my-4 xl:text-start xl:ml-6">
                <p>{productsData[index].productName}</p>
                <p>Quantity: {ordersList[index].desiredQuantity}</p>
                <p>Total Price: {ordersList[index].totalPrice}€</p>
                <p>Date: {`${month}-${day}-${year}`}</p>
              </div>
          </div>
        )
      })
      }
    </div>
  )
}
