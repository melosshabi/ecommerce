import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
// Next Auth options
import {nextAuthOptions} from '../auth/[...nextauth]/options'
import { ObjectId } from "mongodb"

const quantityActions = {
    inc:'increment',
    dec:'decrement'
}

export async function PATCH(req:Request){
    const data = await req.json()
    const session = await getServerSession(nextAuthOptions)
    
    if(data.action === quantityActions.inc){
        const userCartList = await userModel.findOne({_id:new ObjectId(session?.user.userDocId)}, 'cart')
        const currentCart = [...userCartList.cart]
        currentCart.forEach(item => {
            if(data.productDocId === item.productDocId.toString()){
                item.desiredQuantity += 1
            }
        })
        await userModel.updateOne({_id:new ObjectId(session?.user.userDocId)}, {cart:currentCart})
        
        return NextResponse.json({msg:'Cart updated successfully', msgCode:"cart-updated"})

    }else if(data.action === quantityActions.dec){
        const userCartList = await userModel.findOne({_id:new ObjectId(session?.user.userDocId)}, 'cart')
        const currentCart = [...userCartList.cart]
        currentCart.forEach(item => {
            if(data.productDocId === item.productDocId.toString()){
                item.desiredQuantity -= 1
            }
        })
        await userModel.updateOne({_id:new ObjectId(session?.user.userDocId)}, {cart:currentCart})
        
        return NextResponse.json({msg:'Cart updated successfully', msgCode:"cart-updated"})
    }
    return NextResponse.json({errorMessage:"Bad Request"}, {status:400})
}