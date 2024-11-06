import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { decrypt } from "@/lib/authLib"
import connectToDb from "@/lib/mongodb"

export async function PATCH(req:Request) {
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const authorization = req.headers.get("Authorization")
        if(!authorization){
            return NextResponse.json({msg:"unauth"}, {status:401})
        }
        const token = authorization.split(" ")[1]
        const user = await decrypt(token)
        const data = await req.json()
        await connectToDb()
        try {
            await productModel.updateOne({_id:new ObjectId(data.productDocId as string), posterDocId:new ObjectId(user._id as string)}, {quantity:data.newQuantity})
            return NextResponse.json({msg:'product-updated'})
        } catch (err) {
            return NextResponse.json({msg:"product-update-failed"}, {status:500})
        }
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before making changes to your product", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.json()

    let product
    try{
        await connectToDb()
        product = await productModel.findOne({_id:new ObjectId(data.productDocId)})
    }catch(err){
        return NextResponse.json({errMsg:"Product not found"}, {status:400})
    }
    
    if(session?.user.userDocId.toString() === product.posterDocId.toString()){
        await connectToDb()
        await productModel.findOneAndUpdate({_id:new ObjectId(data.productDocId)}, {quantity:data.newQuantity})
    }
    
    return NextResponse.json({errMsg:'An unkown error occurred'}, {status:500})
}