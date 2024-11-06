import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import productModel from "@/models/product"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { decrypt } from "@/lib/authLib"
import connectToDb from "@/lib/mongodb"

export async function DELETE(req:Request){
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const authorization = req.headers.get("Authorization")
        if(!authorization) return NextResponse.json({msg:"unauthenticated"}, {status:403})
        const token = authorization.split(" ")[1]
        const user = await decrypt(token)
        const data = await req.json()
        await connectToDb()
        const dbDeletionRes = await productModel.deleteOne({_id:new ObjectId(data.productDocId), posterDocId:new ObjectId(user._id as string)})
        if(dbDeletionRes.deletedCount === 0){
            return NextResponse.json({msg:"unlist-failed"}, {status:500})
        }
        return NextResponse.json({msg:"product-unlisted"})
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMsg:"You need to sign in before removing a product", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.json()
    await connectToDb()
    const dbDeletionRes = await productModel.deleteOne({_id:new ObjectId(data.productToDeleteId), posterDocId:new ObjectId(session?.user.userDocId)})
    if(dbDeletionRes.deletedCount === 0){
        return NextResponse.json({msg:"unlist-failed"}, {status:500})
    }
    return NextResponse.json({msg:"product-unlisted"})
}