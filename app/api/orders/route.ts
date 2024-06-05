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
    // if(!session){
    //     return NextResponse.json({errMsg:"You need to sign in to view your orders", errCode:"unauthenticated"}, {status:400})
    // }   

    // The params below are used for the orderDetails page
    const {searchParams} = new URL(req.url)
    const singleOrder = searchParams.get('singleOrder')
    const orderId = searchParams.get('orderId')
    const productDocID = searchParams.get('productDocId')

    if(singleOrder && !JSON.parse(orderId as string) && !JSON.parse(productDocID as string)){
        return NextResponse.json({errMsg:"An order id and product doc id are required to get the order details", errCode:"incomplete-query"}, {status:400})
    }

    // The code below fetches the order data and the product data and returns it to display on the orderDetails page
    if(singleOrder){ 
        const resObj = await orderModel.findOne({orderId:orderId})
        const order = {...resObj._doc}
        const tempArr = order.cardNumber.split("")
        tempArr.splice(0, 13)
        order.cardNumber = `***********${tempArr.join("")}`
        const product = await productModel.findOne({_id:new ObjectId(productDocID as string)})

        return NextResponse.json({order, product})
    }

    // The code below fetches all orders and all products that will be displayed on the userOrders page
    if(session){
        const userOrders = await orderModel.find({clientDocId:new ObjectId(session?.user.userDocId)})
        // for(let i = 0; i < userOrders.length; i++){
            // const productDetails = await productModel.findOne({_id:userOrders[i].productDocId}, {productName:1, pictures:1})
            // products.push(productDetails)
        // }
        
        const orderPromises = userOrders.map(async (order, index) => {
            console.log(userOrders[index])
            const productDetails = await productModel.findOne({_id:new ObjectId(userOrders[index].productDocId)})
            return productDetails
        })
        const products = await Promise.all(orderPromises)
        console.log("Fetched Products: ", products)
        return NextResponse.json({userOrders, products})
    }
}