import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    const data = await req.json()
    await connectToDb()
    try{
        await productModel.create({
            posterDocId:new mongoose.Types.ObjectId(data._id),
            productName:data.product.productName,
            productPrice:parseFloat(data.product.productPrice),
            productReviews:[],
            quantity:parseInt(data.product.productQuantity)
        })
    }catch(err:any){
        if(err._message === 'Product validation failed'){
            return NextResponse.json({
                errorMessage:"Please fill out the form",
                errorCode:"incomplete-form",
            }, {status:400})
        }
    }

    return NextResponse.json({
        message:"Product posted successfully",
        messageCode:"product-created",
    }, {status:201})
}