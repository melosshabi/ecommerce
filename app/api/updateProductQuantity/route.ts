import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function PATCH(req:Request) {
    const data = await req.json()
    const session = await getServerSession(nextAuthOptions)

    let product
    try{
        product = await productModel.findOne({_id:new ObjectId(data.productDocId)})
    }catch(err){
        return NextResponse.json({errMsg:"Product not found"}, {status:400})
    }
    
    if(session?.user.userDocId.toString() === product.posterDocId.toString()){
        await productModel.findOneAndUpdate({_id:new ObjectId(data.productDocId)}, {quantity:data.newQuantity})
    }
    
    return NextResponse.json({errMsg:'An unkown error occurred'}, {status:500})
}