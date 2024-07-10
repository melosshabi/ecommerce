export default async function placeOrder(cartItems:CartProduct[]):Promise<string>{    
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {
        method:"POST",
        body:JSON.stringify([...cartItems])
    })
    const data: {url:string, stripeSessionId:string} = await res.json()
    localStorage.setItem('stripeSessionId', data.stripeSessionId)
    return data.url
}