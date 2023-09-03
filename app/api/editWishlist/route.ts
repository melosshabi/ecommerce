import userModel from "@/models/user"
import { NextResponse } from "next/server"

export async function PATCH(req:Request){
    const data = await req.json()

    try {
        await userModel.findOneAndUpdate({userId:data.userId}, {
            $push:{wishlist:data.productDocId}
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
    const data = await req.json()

    try {
        await userModel.findOneAndUpdate({userId:data.userId}, {
            $pull:{wishlist:data.productDocId}
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