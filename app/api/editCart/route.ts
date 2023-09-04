import productModel from "@/models/product"
import userModel from "@/models/user"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function PATCH(req:Request){
    const data = await req.json()

    try{
        const product = await productModel.findOne({_id: new ObjectId(data.productDocId)})
        if(data.quantity > product.quantity){
            return NextResponse.json({
                errorMessage:"Can't add more items to your cart than there is available",
                errorCode:"invalid-quantity"
            })
        }
        await userModel.findOneAndUpdate({userId:data.userId}, {
            $push:{cart:{productDocId:data.productDocId, quantity:data.quantity, dateAdded:new Date()}}
        }, {new:true})
        return NextResponse.json({
            message:"Added to cart",
            messageCode:"added-to-cart"
        })
    }catch(err){
        return NextResponse.json({
            errorMessage:"There was a problem adding this product to your cart",
            errorCode:"unkown-error"
        })
    }
}

export async function DELETE(req:Request){
    const data = await req.json()

    try{
        await userModel.findOneAndUpdate({userId:data.userId}, {
            $pull:{cart:{productDocId:data.productDocId}}
        }, {new:true})
        return NextResponse.json({
            message:"Removed from cart",
            messageCode:"removed-from-cart"
        })
    }catch(err){
        return NextResponse.json({
            errorMessage:"There was a problem",
            errorCode:'unkown-error'
        })
    }
}