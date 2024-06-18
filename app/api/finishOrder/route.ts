import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/user";
import { ObjectId } from "mongodb";
import orderModel from "@/models/order";
import { FinishOrderData } from "@/backendTypes";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!)
export async function POST(req:NextRequest){
    const serverSession = await getServerSession(nextAuthOptions)
    const data: FinishOrderData = await req.json()
    // const stripeSession = await stripe.financialConnections.sessions.retrieve(data.stripeSessionId)
    const stripeSessionLineItems = await stripe.checkout.sessions.listLineItems(data.stripeSessionId, {
        expand: ['data.price.product']
    })
    const newOrderEntriesPromises: Promise<any>[] = []
    stripeSessionLineItems.data.forEach(item => {
        if(serverSession){
            const newOrderPromise = orderModel.create({
                clientDocId:serverSession.user.userDocId,
                // @ts-ignore
                productDocId:item.price?.product.metadata.databaseProductId,
                desiredQuantity:item.quantity,
                productPrice:item.price?.unit_amount! / 100,
                totalPrice:(item?.price?.unit_amount! / 100) * item.quantity!
            })
            newOrderEntriesPromises.push(newOrderPromise)
        }else{
            const newOrderPromise = orderModel.create({
                clientDocId:null,
                // @ts-ignore
                productDocId:item.price?.product.metadata.databaseProductId,
                desiredQuantity:item.quantity,
                productPrice:item.price?.unit_amount! / 100,
                totalPrice:(item?.price?.unit_amount! / 100) * item.quantity!
            })
            newOrderEntriesPromises.push(newOrderPromise)
        }
    })

    if(serverSession){
        const newOrders = await Promise.all(newOrderEntriesPromises)
        await Promise.all(newOrders.map(async order => {
            await userModel.updateOne({_id:new ObjectId(serverSession.user.userDocId)}, {cart:[], $push:{orders:order._id}})
        }))
    }else{
        const orders = await Promise.all(newOrderEntriesPromises)
        return NextResponse.json({msg:"Order placed", orders})
    }
    return NextResponse.json({msg:"Order placed", code:'order-placed'})
}