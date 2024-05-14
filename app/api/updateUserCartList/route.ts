import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "../auth/[...nextauth]/options"

export async function PATCH(req:Request){
    const serverSession = await getServerSession(nextAuthOptions)
    if(!serverSession?.user) return NextResponse.json({errorMessage:"You need to sign in before updating your DB Cart"}, {status:400})
    const data = await req.json()
    try {
        await userModel.findOneAndUpdate({_id:data.userId}, {cart:data.newCartList})
    } catch (error) {
        return NextResponse.json({msg:'An error occurred while updating the user cart'}, {status:500})
    }
    return NextResponse.json({msg:'cart-updated'})
}

