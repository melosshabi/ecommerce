"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ThankYouPage(){
    const router = useRouter()
    useEffect(() => {
        localStorage.removeItem('localCart')
        // The finish order API route clears the cart on the database and creates a new document in the orders collection
        function finishOrder(){
            fetch(`${process.env.NEXT_PUBLIC_URL}/api/finishOrder`, {
                method:"POST",
                body:JSON.stringify({
                    stripeSessionId:localStorage.getItem('stripeSessionId')
                })
            })
            localStorage.removeItem('stripeSessionId')
        }
        finishOrder()
        setTimeout(() => router.push('/'), 5000)
    }, [])
    return (
        <div>
            <p>Thank you for your order</p>  
        </div>
    )
}