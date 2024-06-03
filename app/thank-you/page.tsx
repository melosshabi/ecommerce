"use client"
import { useEffect } from "react"

export default function ThankYouPage(){

    useEffect(() => {
        localStorage.removeItem('localCart')
        // The finish order API route clears the cart on the database and creates a new document in the orders collection
        async function finishOrder(){
            await fetch(`${process.env.NEXT_PUBLIC_URL}/api/finishOrder`, {
                method:"POST",
                body:JSON.stringify({
                    stripeSessionId:localStorage.getItem('stripeSessionId')
                })
            })
        }
        finishOrder()
    }, [])
    return (
        <div>
         <p>hi</p>  
        </div>
    )
}