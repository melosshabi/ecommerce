import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import { ObjectId } from "mongodb"

export async function PATCH(req:Request){
    
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before editing your wishlist", errCode:"unauthenticated"}, {status:400})
    }

    const data = await req.json()

    try {
        await userModel.findOneAndUpdate({_id: new ObjectId(session?.user.userDocId)}, {
            $push:{wishlist:{
                productDocId:data.productDocId,
                dateAdded: new Date()
            }}
        }, {new:true})

        return NextResponse.json({
            message:"Added to wishlist",
            messageCode:"added-to-wishlist"
        })
    } catch (error) {
        return NextResponse.json({
            errorMessage:"Something went wrong",
            messageCode:"unkown-error"
        })
    }
}
export async function DELETE(req:Request){
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before editing your wishlist", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.json()
    try {
        await userModel.findOneAndUpdate({_id: new ObjectId(session?.user.userDocId)}, {
            $pull:{wishlist:{productDocId:data.productDocId}}
        }, {new:true})

        return NextResponse.json({
            messageCode:'removed-from-wishlist',
            message:'Removed from wishlist'
        })
    } catch (error) {
        return NextResponse.json({
            message:"wishlist-error",
            messageCode:'unkown-error'
        })
    }
}