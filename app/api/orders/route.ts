import orderModel from "@/models/order"
import { NextResponse } from "next/server"
import {getServerSession} from 'next-auth'
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import userModel from "@/models/user"

// The function below creates a new order document
export async function POST(req:Request){
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMsg:"You need to be signed in to place orders", errCode:"unauthenticated"}, {status:400})
    }

    const data: orderData = await req.json()
    try{
        const product = await productModel.findOne({_id:new ObjectId(data.productDocId)}).select('quantity productPrice')

        if(data.desiredQuantity > product.quantity){
            return NextResponse.json({errMsg:"Can't order more of a product than there is available", errCode:"over-available-quantity"})
        }

        const orderId = Math.round(Math.random() * 999999)

        const order = await orderModel.create({
            clientDocId:session?.user.userDocId,
            productDocId:data.productDocId,
            desiredQuantity:parseInt(data.desiredQuantity),
            orderId,
            orderPrice:product.productPrice * parseInt(data.desiredQuantity),
            cardNumber:data.cardNumber,
            expirityMonth:data.expirityMonth,
            expirityYear:data.expirityYear,
            cvv:data.cvv,
            firstName:data.firstName,
            lastName:data.lastName,
            billingAddress:data.billingAddress,
            billingAddress2:data.billingAddress2,
            phoneNumber:data.phoneNumber,
            city:data.city,
            zipCode:data.zipCode
        })

        await userModel.findOneAndUpdate({_id: new ObjectId(session.user.userDocId)}, {$push:{orders:order._id}})
    }
    catch(err:any){
        if(err._message === 'Order validation failed'){
            return NextResponse.json({errMsg:"Incomplete form", errCode:'incomplete-form'}, {status:400})
        }
    }
    return NextResponse.json({msg:'Order placed successfully', msgCode:"order-placed"})
}

// The function below returns the currently placed orders to the user
export async function GET(req:Request){
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMsg:"You need to sign in to view your orders", errCode:"unauthenticated"}, {status:400})
    }   

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
    const products: Product[] = []
    const userOrders = await orderModel.find({clientDocId:new ObjectId(session?.user.userDocId)})
    for(let i = 0; i < userOrders.length; i++){
        const productDetails = await productModel.findOne({_id:userOrders[i].productDocId}, {productName:1, pictures:1})
        products.push(productDetails)
    }
    return NextResponse.json({userOrders, products})
}