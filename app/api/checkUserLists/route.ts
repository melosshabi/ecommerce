import { decrypt } from "@/lib/authLib";
import connectToDb from "@/lib/mongodb";
import userModel from "@/models/user";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const mobile = req.headers.get("Mobile")
    const authorization = req.headers.get("Authorization")
    const {searchParams} = new URL(req.url)
    if(mobile && authorization && searchParams){
        const token = authorization.split(" ")[1]
        const user = await decrypt(token)
        const productId = searchParams.get('_id')
        try{
            await connectToDb()
            const userDb = await userModel.findOne({_id: new ObjectId(user._id as string)})
            const productExists = {
                wishlist:false,
                cart:false
            }
            userDb.wishlist.some((product:WishlistObject) => {
                if(product.productDocId.toString() === productId){
                    productExists.wishlist = true
                }
            })
            userDb.cart.some((product:CartObject)=> {
                if(product.productDocId.toString() === productId){
                    productExists.cart = true
                }
            })
            return NextResponse.json({productExists})
        }catch(err){
            return NextResponse.json({msg:'unkown-error'}, {status:500})
        }
    }
}