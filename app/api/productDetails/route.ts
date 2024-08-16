import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(req:Request){
        const {searchParams} = new URL(req.url)
        const _id = searchParams.get('_id')
        if(!_id) {
            return NextResponse.json({errorMessage:"An ID is required", errorCode:'no-id'}, {status:400})
        }
        const product = await productModel.findOne({_id})
        if(product){    
            return NextResponse.json(product)
        }
        return NextResponse.json({errorMessage:"Couldn't fetch product data", errorCode:"couldnt-fetch"})
}