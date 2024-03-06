import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function PATCH(req:Request) {
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before making changes to your product", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.json()

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