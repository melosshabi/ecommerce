import { comparePasswords } from "@/lib/bcrypt";
import userModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import connectToDb from "@/lib/mongodb";
import { encrypt } from "@/lib/authLib";

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
    const expires = new Date(Date.now() + 604800)
    cookies().set('session', session, {
        httpOnly:true,
        secure:true,
        expires,

    })
    return NextResponse.json({session})
}
export async function GET(req:NextRequest){
    console.log(req)
    return NextResponse.json({msg:'hi'})
    // await connectToDb()
    // const user = await userModel.findOne({username:req.headers.get})
}
