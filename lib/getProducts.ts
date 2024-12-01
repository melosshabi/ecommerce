import productModel from "@/models/product"
import connectToDb from "./mongodb"

export async function getProducts(){
    await connectToDb()
    const res = await productModel.find({})
    return res
}