"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ThankYouPage(){
    const router = useRouter()
    const session = useSession()
    useEffect(() => {
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
                    console.log(localOrders)
                }
            }
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