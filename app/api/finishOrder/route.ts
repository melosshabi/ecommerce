import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
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
    const stripeSessionLineItems = await stripe.checkout.sessions.listLineItems(data.stripeSessionId, {
        expand: ['data.price.product']
    })
    // This array holds the IDs of the documents of the products that are stored on mongodb
    const databaseProductIds = []
    stripeSessionLineItems.data.forEach(item => console.log(item))
    if(serverSession){
        const userOrdersPromise = userModel.findOneAndUpdate({_id:new ObjectId(serverSession.user.userDocId)})
        // const ordersPromise = orderModel.create({
            // clientDocId:serverSession.user.userDocId,
            // productsOrdered: 
        // })
    }
}