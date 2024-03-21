import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function DELETE(req:Request){
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before removing a product", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.json()
    const product = await productModel.deleteOne({_id:new Object(data.productToDeleteId), posterDocId:new ObjectId(session?.user.userDocId)})
    if(product.deletedCount === 0){
        return NextResponse.json({message:"There was a problem deleting this product", msgCode:'failed-to-delete'})
    }
    return NextResponse.json({message:"Unlisted Successfully", msgCode:"product-unlisted"})
}