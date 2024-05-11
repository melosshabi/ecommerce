import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import { NextResponse } from "next/server"

export async function GET(req:Request){
    const params = new URL(req.url).searchParams
    const query = params.get("userQuery")
    if(!query){
        return NextResponse.json({errMessage:"Invalid Query"}, {status:400})
    }
    await connectToDb()
    const regex = new RegExp(query, 'i')
    const queryByProductName = productModel.find({productName:regex})
    const queryByBrandName = productModel.find({brandName:regex})
    const queryByManufacturer = productModel.find({manufacturer:regex})
    let products: Product[] = []
    await Promise.all([queryByProductName, queryByBrandName, queryByManufacturer])
    .then(res => {
        res.forEach(array => {
            if(array.length > 0){
                products = [...array]
            }
        })
    })
    return NextResponse.json({products})
}