import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
// Next Auth options
import {nextAuthOptions} from '../auth/[...nextauth]/options'
import { ObjectId } from "mongodb"
import productModel from "@/models/product"

export async function PATCH(req:Request){
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before making changes to your cart", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.json()
    if(data.newQuantity < 1){
        return NextResponse.json({errMessage:"Bad Request"}, {status:400})
    }

    try{
        await productModel.exists({_id:new ObjectId(data.productDocId)})
    }catch(err){
        return NextResponse.json({errMessage:"Product does not exist"}, {status:400})
    }

    const userCartList = await userModel.findOne({_id:new ObjectId(session?.user.userDocId)}, 'cart')
    const currentCart = [...userCartList.cart]
    currentCart.forEach(item => {
        if(data.productDocId === item.productDocId.toString()){
            item.desiredQuantity = data.newQuantity
        }
    })
    await userModel.updateOne({_id:new ObjectId(session?.user.userDocId)}, {cart:currentCart})
    
    return NextResponse.json({msg:'Cart updated successfully', msgCode:"cart-updated"})
}