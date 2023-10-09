import orderModel from "@/models/order"
import { NextResponse } from "next/server"
import {getServerSession} from 'next-auth'
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import userModel from "@/models/user"

type data = {
    productDocId:string,
    desiredQuantity:string,
    cardNumber:string,
    expirityMonth:string,
    expirityYear:string,
    cvv:string,
    firstName:string,
    lastName:string,
    billingAddress:string,
    billingAddress2?:string,
    phoneNumber:string,
    city:string,
    zipCode:string
}
export async function POST(req:Request){
    const data: data = await req.json()
    const session = await getServerSession(nextAuthOptions)

    if(!session){
        return NextResponse.json({errMsg:"You need to be signed in to place orders", errCode:"unauthenticated"}, {status:400})
    }

    try{

        const product = await productModel.findOne({_id:new ObjectId(data.productDocId)}).select('quantity productPrice')

        if(data.desiredQuantity > product.quantity){
            return NextResponse.json({errMsg:"Can't order more of a product than there is available", errCode:"over-available-quantity"})
        }

        const orderId = `#${Math.round(Math.random() * 999999)}`

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