import orderModel from "@/models/order"
import { NextRequest, NextResponse } from "next/server"
import {getServerSession} from 'next-auth'
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import Stripe from 'stripe'
import { decrypt } from "@/lib/authLib"
import connectToDb from "@/lib/mongodb"

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!)
// The function below creates stripe sessions
export async function POST(req:NextRequest){
    const mobile = req.headers.get("Mobile") === 'true'
    if(mobile){
        try{
            const body = await req.json()
            if(!body.products){
                return NextResponse.json({responseMessage:"missing-products"}, {status:400})
            }
            let amount = 0
            body.products.forEach((product:ProductData) => amount += product.price)
            const customer = await stripe.customers.create()
            const ephemeralKey = await stripe.ephemeralKeys.create(
                {customer:customer.id},
                {apiVersion:'2024-12-18.acacia'}
            )
            const paymentIntent = await stripe.paymentIntents.create({
                amount:amount * 100,
                currency:'eur',
                customer:customer.id as string,
                
            })
            
            return NextResponse.json({
                paymentIntent:paymentIntent.client_secret,
                ephemeralKey:ephemeralKey.secret,
                customer:customer.id,
            })
        }catch(err){
            console.log(err)

            if(err instanceof Error && err.name === "JWTExpired"){
                return NextResponse.json({responseMessage:"jwt-expired"}, {})
            }
        }
    }else{
        const calledFromCart = req.headers.get('CalledOrderFromCart') === 'true'
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
                success_url:`${process.env.NEXT_PUBLIC_URL}/thank-you?calledFromCart=${calledFromCart}`,
                cancel_url:`${process.env.NEXT_PUBLIC_URL}/userProfile/cart`,
            })

            return NextResponse.json({url:stripeSession.url, stripeSessionId:stripeSession.id})
        }catch(err){
            console.log(err)
            // @ts-ignore
            return NextResponse.json({err:err.message}, {status:500})
        }
    }
    
    
}

// The function below returns the currently placed orders to the user
export async function GET(req:Request){
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const authorization = req.headers.get("Authorization")
        const token = authorization?.split(" ")[1]
        if(!authorization || !token) return NextResponse.json({msg:"unauthenticated"}, {status:403})
        const user = await decrypt(token as string)
        await connectToDb()
        const userOrders: OrderData[] = await orderModel.find({clientDocId:new ObjectId(user._id as string)})
        const productPromises: Promise<ProductData>[] = []
        userOrders.map(async order => {
            const productPromise = productModel.findOne({_id:new ObjectId(order.productDocId)})
            productPromises.push(productPromise)
        })
        const products = await Promise.all(productPromises)
        return NextResponse.json({userOrders, products})
    }
    const session = await getServerSession(nextAuthOptions)

    // The code below fetches all orders and all products that will be displayed on the userOrders page
    if(session){
        // The orders that have been placed by the current authenticated user
        await connectToDb()
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