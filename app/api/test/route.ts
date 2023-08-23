import connectToDb from "@/lib/mongodb"
import User from "@/models/user"
import { NextResponse } from "next/server"
import hashPassword from "@/lib/hashPassword"

export async function POST(req:Request, res:Response){
    const {username, email, password} = await req.json()

    const hashedPassword = await hashPassword(password)
    await connectToDb()
    await User.create({username, email, password:hashedPassword})
    return NextResponse.json({message:"Account Created"}, {status:201})
}