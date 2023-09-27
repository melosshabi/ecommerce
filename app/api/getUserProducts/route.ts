import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import { ObjectId } from "mongodb"

export async function GET(req:Request) {
    const session = await getServerSession(nextAuthOptions)
    await connectToDb()
    const products = await productModel.find({posterDocId:new ObjectId(session?.user.userDocId)})
    return NextResponse.json({products})
}