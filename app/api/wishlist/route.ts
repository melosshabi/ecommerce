import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import { ObjectId } from "mongodb"
import { BackendWishlistProduct, WishlistItem } from "@/backendTypes"
import { decrypt } from "@/lib/authLib"
import productModel from "@/models/product"
import connectToDb from "@/lib/mongodb"

export async function GET(req:Request){
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const session = req.headers.get("Authorization")
        if(!session){
            return NextResponse.json({errMsg:"unauthenticated"}, {status:401})
        }
        const token = session?.split(" ")[1]
        const user = await decrypt(token)
        await connectToDb()
        const userDb = await userModel.findOne({_id:new ObjectId(user._id as string)})
        const productPromises: Promise<Product>[] = []
        const wishlistItems:WishlistItem[] = []
        userDb.wishlist.forEach((product:BackendWishlistProduct) => {
            const promise = productModel.findOne({_id:product.productDocId})
            productPromises.push(promise)
        })
        await Promise.all(productPromises).then(res => {
            res.forEach((product:Product) => {
                const {_id, productName, productPrice, manufacturer} = product
                wishlistItems.push({productDocId:_id, productName, productPrice, manufacturer, productImage:product.pictures[0]})
            })
        })
        return NextResponse.json({wishlistItems})
    }
}

export async function PATCH(req:Request){
    const mobile = req.headers.get("Mobile")
    const data = await req.json()
    if(mobile){
        const authorization = req.headers.get("Authorization")
        const token = authorization?.split(" ")[1]
        const user = await decrypt(token as string)
        try {
            await connectToDb()
            const userDb = await userModel.findOne({_id: new ObjectId(user._id as string)})
            if(userDb.wishlist.some((product:BackendWishlistProduct) => product.productDocId.toString() == data.productDocId)){
                return NextResponse.json({
                    message:"Product already in wishlist",
                    messageCode:"product-already-in-wishlist"
                }, {status:400})
            }
            await userModel.findOneAndUpdate({_id: new ObjectId(user._id as string)}, {
                $push:{wishlist:{
                    productDocId:new ObjectId(data.productDocId),
                    dateAdded: new Date()
                }}
            }, {new:true})
    
            return NextResponse.json({
                message:"Added to wishlist",
                messageCode:"added-to-wishlist"
            })
        }catch (error) {
            return NextResponse.json({
                errorMessage:"Something went wrong",
                messageCode:"unkown-error"
            }, {status:400})
        }
    }
    
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before editing your wishlist", errCode:"unauthenticated"}, {status:400})
    }

    try {
        await connectToDb()
        const user = await userModel.findOne({_id: new ObjectId(session?.user.userDocId)})
        if(user.wishlist.some((product:BackendWishlistProduct) => product.productDocId.toString() == data.productDocId)){
            return NextResponse.json({
                message:"Product already in wishlist",
                messageCode:"product-already-in-wishlist"
            }, {status:400})
        }
        await userModel.findOneAndUpdate({_id: new ObjectId(session?.user.userDocId)}, {
            $push:{wishlist:{
                productDocId:new ObjectId(data.productDocId),
                dateAdded: new Date()
            }}
        }, {new:true})
        session.user.wishlist.push({
            productDocId:data.productDocId,
            dateAdded: new Date().toISOString()
        })

        return NextResponse.json({
            message:"Added to wishlist",
            messageCode:"added-to-wishlist"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            errorMessage:"Something went wrong",
            messageCode:"unkown-error"
        }, {status:400})
    }
}

export async function DELETE(req:Request){
    const data = await req.json()
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const session = req.headers.get("Authorization")
        const token = session?.split(" ")[1]
        if(token){
            const user = await decrypt(token)
            try{
                const ids: ObjectId[] = []
                data.itemsToRemove.forEach((id:string) => {
                    ids.push(new ObjectId(id))
                })
                await connectToDb()
                await userModel.findOneAndUpdate({_id:new ObjectId(user._id as string)},{
                    $pull:{wishlist:{productDocId:{$in: ids}}}
                })
                return NextResponse.json({msg:"products deleted"})
            }catch(err){
                return NextResponse.json({msg:"Failed"}, {status:500})
            }
            
        }
        return NextResponse.json({err:"unauthenticated"}, {status:400})
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before editing your wishlist", errCode:"unauthenticated"}, {status:400})
    }
    try {
        await connectToDb()
        await userModel.findOneAndUpdate({_id: new ObjectId(session?.user.userDocId)}, {
            $pull:{wishlist:{productDocId:new ObjectId(data.productDocId)}}
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