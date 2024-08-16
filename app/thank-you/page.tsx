"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import '../styles/thankyou.css'

export default function ThankYouPage(){
    const router = useRouter()
    const session = useSession()
    const [seconds, setSeconds] = useState(5)
    useEffect(() => {
        // if(!localStorage.getItem('stripeSessionId')) router.push('/')
        localStorage.removeItem('localCart')
        // The finish order API route clears the cart on the database and creates a new document in the orders collection
        async function finishOrder(){
            if(session.status === 'authenticated'){
                fetch(`${process.env.NEXT_PUBLIC_URL}/api/finishOrder`, {
                    method:"POST",
                    body:JSON.stringify({
                        stripeSessionId:localStorage.getItem('stripeSessionId')
                    })
                })
                localStorage.removeItem('stripeSessionId')
            }else{
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/finishOrder`, {
                    method:"POST",
                    body:JSON.stringify({
                        stripeSessionId:localStorage.getItem('stripeSessionId')
                    })
                })
                localStorage.removeItem('stripeSessionId')
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
        const secondsInterval = setInterval(() => setSeconds(prev => prev -= 1), 1000)
        setTimeout(() => {
            clearInterval(secondsInterval)
            router.push('/')
        }, 5000)
        }, [])
    return (
        <div className="thank-you-wrapper">
            <h1>Thank you for your order!</h1>
            <p>Your order has been placed and is being processed.</p> 
            <p>Returning to home page in: {seconds}</p>
            <a className="home-link" href="/">Back to Homepage</a>
        </div>
    )
}