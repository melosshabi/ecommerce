"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ThankYouPage(){
    const router = useRouter()
    const session = useSession()
    const [seconds, setSeconds] = useState(5)
    const params = useSearchParams()
    const calledFromCart = params.get('calledFromCart')
    useEffect(() => {
        if(!localStorage.getItem('stripeSessionId')) router.push('/')
        if(calledFromCart) localStorage.removeItem('localCart')
        // The finish order API route clears the cart on the database and creates a new document in the orders collection
        async function finishOrder(){
            if(session.status === 'authenticated'){
                const stripeSessionId = localStorage.getItem('stripeSessionId')
                await fetch(`${process.env.NEXT_PUBLIC_URL}/api/finishOrder?calledFromCart=${calledFromCart}`, {
                    method:"POST",
                    body:JSON.stringify({
                        stripeSessionId:stripeSessionId
                    })
                })
                await session.update()
            }else if(session.status === 'unauthenticated'){
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/finishOrder`, {
                    method:"POST",
                    body:JSON.stringify({
                        stripeSessionId:localStorage.getItem('stripeSessionId')
                    })
                })
                const data = await res.json()
                let localOrders = JSON.parse(localStorage.getItem("localOrders") as string)
                if(!localOrders){
                    localStorage.setItem('localOrders', JSON.stringify([...data.orders]))
                }else{
                    localOrders = [...localOrders, ...data.orders]
                    localStorage.setItem("localOrders", JSON.stringify(localOrders))
                }
            }
        }
        finishOrder()
        }, [session])
        useEffect(() => {
            const secondsInterval = setInterval(() => setSeconds(prev => prev -= 1), 1000)
            setTimeout(() => {
                clearInterval(secondsInterval)
                router.push('/')
            }, 5000)
        }, [])
    return (
        <div className="h-[90dvh] mt-[10dvh] flex items-center justify-center flex-col text-center">
            <h1 className="text-[1.8em]">Thank you for your order!</h1>
            <p>Your order has been placed and is being processed.</p> 
            <p>Returning to home page in: {seconds}</p>
            <Link className="text-orange font-medium mt-2 text-lg transition-all duration-100 hover:underline hover:text-darkerOrange" href="/">Back to Homepage</Link>
        </div>
    )
}