import orderModel from "@/models/order"
import { NextRequest, NextResponse } from "next/server"
import {getServerSession} from 'next-auth'
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!)
// The function below creates a new order document
export async function POST(req:NextRequest){

    // The products the user wants to order
    const cartProducts: CartProduct[] = await req.json()
    try{
        // @ts-ignore
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:cartProducts.map(product => {
                return {
                    price_data:{
                        currency:'eur',
                        product_data:{
                            name:product.productName,
                            metadata:{
                                databaseProductId:product._id
                            }
                        },
                        unit_amount:product.productPrice * 100,
                    },
                    quantity:product.desiredQuantity
                }
            }),
            mode:'payment',
            success_url:`${process.env.NEXT_PUBLIC_URL}/thank-you`,
            cancel_url:`${process.env.NEXT_PUBLIC_URL}/userProfile/cart`,
        })
        
        return NextResponse.json({url:stripeSession.url, stripeSessionId:stripeSession.id})
    }catch(err){
        console.log(err)
        // @ts-ignore
        return NextResponse.json({err:err.message}, {status:500})
    }
    
}

// The function below returns the currently placed orders to the user
export async function GET(req:Request){
    const session = await getServerSession(nextAuthOptions)

    // The code below fetches all orders and all products that will be displayed on the userOrders page
    if(session){
        // The orders that have been placed by the current authenticated user
        const userOrders: OrderData[] = await orderModel.find({clientDocId:new ObjectId(session?.user.userDocId)})
        const productPromises: Promise<ProductData>[] = []
        userOrders.map(async order => {
            const productPromise = productModel.findOne({_id:new ObjectId(order.productDocId)})
            productPromises.push(productPromise)
        })
        const products = await Promise.all(productPromises)
        return NextResponse.json({userOrders, products})
    }
}