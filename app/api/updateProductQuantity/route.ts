import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

const quantityActions = {
    inc:'inc',
    dec:'dec'
}

export async function PATCH(req:Request) {
    const data = await req.json()
    const session = await getServerSession(nextAuthOptions)

    const product = await productModel.findOne({_id:new ObjectId(data.productDocId)})
    
    if(session?.user.userDocId.toString() === product.posterDocId.toString()){
        if(data.action === quantityActions.inc){
            await productModel.findOneAndUpdate({_id:new ObjectId(data.productDocId)}, {$inc:{quantity:1}})
            return NextResponse.json({msg:"Quantity Updated Sucessfully", msgCode:"quantity-updated"})
        }
        else if(data.action === quantityActions.dec){
            await productModel.findOneAndUpdate({_id:new ObjectId(data.productDocId)}, {$inc:{quantity:-1}})
            return NextResponse.json({msg:"Quantity Updated Sucessfully", msgCode:"quantity-updated"})
        }
    }
    return NextResponse.json({errorMessage:"An error occurred", erroCode:"unkown-error"})
}