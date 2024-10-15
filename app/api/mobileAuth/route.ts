import { comparePasswords } from "@/lib/bcrypt";
import userModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import connectToDb from "@/lib/mongodb";
import { decrypt, encrypt, verifyToken } from "@/lib/authLib";
import { ObjectId } from "mongodb";

type MobileAuthData = {
    username:string,
    password:string
}
export async function POST(req:NextRequest){
    const data:MobileAuthData = await req.json()
    if(!data.username || !data.password){
        return NextResponse.json({err:"incomplete-form"}, {status:400})
    }
    await connectToDb()
    const user = await userModel.findOne({username:data.username})
    if(!user){
        return NextResponse.json({err:"username-not-found"}, {status:400})
    }
    const matched = await comparePasswords(data.password, user.password)
    if(!matched){
        return NextResponse.json({err:"incorrect-password"}, {status:400})
    }
    const {_id, username, email, profilePictureUrl} = user
    const session = await encrypt({_id, username, email, profilePictureUrl, cartItemsCount:user.cart.length})
    return NextResponse.json({session})
}
// This route is used to update the jwt token of the user when they make changes to their account
export async function PATCH(req:NextRequest){
    const data = await req.json()
    if(!data.token){
        return NextResponse.json({err:"invalid-token"}, {status:400})
    }
    const isTokenValid = await verifyToken(data.token)
    if(!isTokenValid.valid){
        return NextResponse.json({msg:'err-verifying-token', details:isTokenValid.error}, {status:400})
    }
    const user = await decrypt(data.token)
    await connectToDb()
    const userDb = await userModel.findOne({_id:new ObjectId(user._id as string)})
    const {_id, username, email, profilePictureUrl, cart} = userDb
    const newToken = await encrypt({_id, username, email, profilePictureUrl, cartItemsCount:cart.length})
    return NextResponse.json({newToken})
}
