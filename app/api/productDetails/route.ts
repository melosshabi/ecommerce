import productModel from "@/models/product"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(req:Request){
    const {searchParams} = new URL(req.url)

        if(!searchParams.get('_id')) {
            return NextResponse.json({errorMessage:"An ID is required", errorCode:'no-id'}, {status:400})
        }
        const product = await productModel.findOne({_id:new ObjectId(searchParams.get('_id') as string)})
        if(product){    
            return NextResponse.json(product)
        }
        return NextResponse.json({errorMessage:"Couldn't fetch product data", errorCode:"couldnt-fetch"})
}