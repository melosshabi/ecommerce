import { BackendCartProduct, BackendWishlistProduct } from "@/backendTypes";
import { decrypt } from "@/lib/authLib";
import connectToDb from "@/lib/mongodb";
import userModel from "@/models/user";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nextAuthOptions } from "../auth/[...nextauth]/options";

async function checkLists(userId:string, productId:string){
    try{
        await connectToDb()
        const userDb = await userModel.findOne({_id: new ObjectId(userId)})
        const productExists = {
            wishlist:false,
            cart:false
        }
        userDb.wishlist.some((product:BackendWishlistProduct) => {
            if(product.productDocId.toString() === productId){
                productExists.wishlist = true
            }
        })
        userDb.cart.some((product:BackendCartProduct)=> {
            if(product.productDocId.toString() === productId){
                productExists.cart = true
            }
        })
        
        return productExists
    }catch(err){
        return false
    }

}
export async function GET(req:NextRequest){
    const mobile = req.headers.get("Mobile")
    const authorization = req.headers.get("Authorization")
    const {searchParams} = new URL(req.url)
    const productId = searchParams.get('_id')
    if(mobile && authorization && searchParams){
        const token = authorization.split(" ")[1]
        const user = await decrypt(token)
        const productExists = await checkLists(user._id as string, productId as string)
        if(!productExists) return NextResponse.json({msg:'unkown-error'}, {status:500})
        return NextResponse.json({productExists})
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({msg:'unauthenticated'}, {status:401})
    }
    const productExists = await checkLists(session.user.userDocId, productId as string)
    if(!productExists) return NextResponse.json({msg:'unkown-error'}, {status:500})
    return NextResponse.json({productExists})
}