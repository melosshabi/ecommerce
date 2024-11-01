import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import { ObjectId } from "mongodb"
import { decrypt } from "@/lib/authLib"

export async function GET(req:Request){
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const authorization = req.headers.get("Authorization")
        if(!authorization){
            return NextResponse.json({msg:"unauthenticated"}, {status:403})
        }
        const token = authorization.split(" ")[1]
        const user = await decrypt(token)
        const products = await productModel.find({posterDocId:new ObjectId(user._id as string)})
        return NextResponse.json({products})
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in", errCode:"unauthenticated"}, {status:400})
    }
    await connectToDb()
    const products = await productModel.find({posterDocId:new ObjectId(session?.user.userDocId)})
    return NextResponse.json({products})
}