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
    const productsOrdered: any[] = []
    let totalPrice = 0
    stripeSessionLineItems.data.forEach(item => {
        // @ts-ignore
        productsOrdered.push({productDocId:item.price?.product.metadata.databaseProductId, desiredQuantity:item.quantity})
        totalPrice += (item.price?.unit_amount! / 100) * item.quantity!
    })

    if(serverSession){
        const newOrderDoc = await orderModel.create({
            clientDocId:serverSession.user.userDocId,
            productsOrdered: [...productsOrdered],
            totalPrice
        })
        await userModel.updateOne({_id:new ObjectId(serverSession.user.userDocId)}, {cart:[], $push:{orders:newOrderDoc._id}})
    }
}