import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(req:Request){
        const {searchParams} = new URL(req.url)
        const _id = searchParams.get('_id')
        const desiredQuantity = searchParams.get("desiredQuantity")
        if(!_id) {
            return NextResponse.json({errorMessage:"An ID is required", errorCode:'no-id'}, {status:400})
        }
        try{
            await connectToDb()
            const product = await productModel.findOne({_id:new ObjectId(_id)})
            if(product){
                if(desiredQuantity) return NextResponse.json({...product._doc,  desiredQuantity:parseInt(desiredQuantity)})
                return NextResponse.json(product)
            }
        }catch(err){
            console.log(err)
            return NextResponse.json({errorMessage:"Couldn't fetch product data", errorCode:"couldnt-fetch"}, {status:500})
        }
}