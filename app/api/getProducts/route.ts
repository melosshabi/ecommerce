import connectToDb from "@/lib/mongodb";
import productModel from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(){
    await connectToDb()
    const products = await productModel.find()
    return NextResponse.json({products})
}