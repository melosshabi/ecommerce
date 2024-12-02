import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/user";
import { ObjectId } from "mongodb";
import orderModel from "@/models/order";
import { FinishOrderData } from "@/backendTypes";
import Stripe from 'stripe'
import { transporter } from "@/lib/nodemailer";
import productModel from "@/models/product";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!)
type HTMLData = {
    name:string,
    products:Array<ProductDataForEmail>,
    subtotal:number,
    total:number,
}
type ProductDataForEmail = {
    productName:string,
    price:number,
    quantity:number
}
function generateHTML(data:HTMLData){
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
    const date = new Date()
    const year = date.getFullYear()
    const month = months[date.getMonth()]
    const monthDate = date.getDate()
    const day = weekday[date.getDay()]
    let hours:number | string = date.getHours()
    let minutes: number | string = date.getMinutes()
    if(hours.toString().length === 1){
        hours = `0${hours}`
    }if(minutes.toString().length === 1){
        minutes = `0${minutes}`
    }
    const fullDate = `${day}, ${month}, ${monthDate} ${year} at ${hours}:${minutes}`
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        </head>
        <body style="width:100%; font-family: 'Work Sans', sans-serif;">
            <div style="width: fit-content; margin:auto;">
                <img style="width:150px;" src="https://res.cloudinary.com/dcdd2szdq/image/upload/v1726326181/ecommerce/txfmmdzmkgtyotvdpan3.png"/>
            </div>
            <h1 style="width:fit-content; margin:auto; display: block; text-align: center;">Thank you for your purchase ${data.name}</h1>
            <h2 style="margin:auto; width: fit-content; margin-top:20px">Your order</h2>
            <h3 style="color:rgb(168, 169, 173); font-weight:300; width: fit-content; margin:auto; margin-top: 20px; margin-bottom:20px;">${fullDate}</h3>
            <div style="width:80%; margin:auto;">
                ${data.products.map(product => (
                    `<div style="width:100%;border-top: 1px solid rgb(168, 169, 173); padding-top:20px;"><span style="width:33.3%; float:left; text-align:left;">${product.productName}</span><span style="width:33.3%; text-align:center;display:inline-block;">Quantity:${product.quantity}</span><span style="width:33.3%;float:right;text-align:right;">€${product.price}</span></div>`
                ))}
                <div class="subtotal" style="width: 100%;border-top: 1px solid rgb(168, 169, 173);margin:20px 0;padding-top: 20px;display: flex;justify-content: space-between;opacity: .8; position:relative;"><span style="width:50%; text-align: left;">Subtotal</span><span style="width:50%; position: absolute; right:0; float:right; text-align: right;">€${data.subtotal}</span></div>
                <div class="total" style="width: 100%;margin:20px 0;padding-top: 20px;font-size: 1.25rem;font-weight: 600;border-top: 3px solid black;border-bottom: 3px solid black;padding-bottom: 20px; position: relative;"><span style="width:50%; text-align: left;">Total</span><span style="width:50%; position: absolute; right:0; float:right; text-align: right;">€${data.total}</span></div>
            </div>
        </body>
</html>`
}
export async function POST(req:NextRequest){
    const serverSession = await getServerSession(nextAuthOptions)
    const data: FinishOrderData = await req.json()
    const session = await stripe.checkout.sessions.retrieve(data.stripeSessionId)
    const userEmail = session.customer_details?.email
    const userFullName = session.customer_details?.name
    const stripeSessionLineItems = await stripe.checkout.sessions.listLineItems(data.stripeSessionId, {
        expand: ['data.price.product']
    })
    const newOrderEntriesPromises: Promise<OrderData>[] = []
    const productsListForEmail: ProductDataForEmail[] = []
    stripeSessionLineItems.data.forEach(item => {
            const newOrderPromise: Promise<OrderData> = orderModel.create({
                clientDocId:serverSession ? serverSession.user.userDocId : null,
                // @ts-ignore
                productDocId:item.price?.product.metadata.databaseProductId,
                desiredQuantity:item.quantity,
                productPrice:item.price?.unit_amount! / 100,
                totalPrice:(item?.price?.unit_amount! / 100) * item.quantity!
            })
            newOrderEntriesPromises.push(newOrderPromise)
            // @ts-ignore
            productsListForEmail.push({productName:item.price?.product.name, price:item.price?.unit_amount / 100, quantity:item.quantity })
})
    const newOrders = await Promise.all(newOrderEntriesPromises)
    if(serverSession){        
        const {searchParams} = new URL(req.url)
        const calledFromCart = searchParams.get('calledFromCart') === 'true'
        await Promise.all(newOrders.map(async order => {
            if(calledFromCart){
                await userModel.updateOne({_id:new ObjectId(serverSession.user.userDocId)}, {cart:[], $push:{orders:order._id}})
            }else{
                await userModel.updateOne({_id:new ObjectId(serverSession.user.userDocId)}, {$push:{orders:order._id}})
            }
            await productModel.updateOne({_id:new ObjectId(order.productDocId)}, {$inc:{quantity:-order.desiredQuantity}})
            
        }))
    }else{
        try {
            await transporter.sendMail({
                from:process.env.EMAIL,
                to:userEmail as string,
                subject: `Thank you for your order ${userFullName}`,
                text:`Thank you for your order ${userFullName}}`,
                html:generateHTML({name:userFullName as string, products: productsListForEmail, subtotal:session.amount_subtotal! / 100, total:session.amount_total! / 100})
            })
        } catch (err) {
            console.log(err)
            return NextResponse.json({msg:"unkown-error"}, {status:500})
        }
        return NextResponse.json({msg:"Order placed", newOrders})
    }
    
    try {
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:userEmail as string,
            subject: `Thank you for your order ${userFullName}`,
            text:`Thank you for your order ${userFullName}}`,
            html:generateHTML({name:userFullName as string, products: productsListForEmail, subtotal:session.amount_subtotal! / 100, total:session.amount_total! / 100})
        })
    } catch (err) {
        console.log(err)
    }
    return NextResponse.json({msg:"Order placed", code:'order-placed'})
}