import connectToDb from "@/lib/mongodb"
import userModel from "@/models/user"
import { NextResponse } from "next/server"

export async function GET(request:Request, response:Response){
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    await connectToDb()
    const user = await userModel.findOne({username:username})
    const paswordLessUser = {
        ...user._doc
    }
    delete paswordLessUser.password
    return NextResponse.json(paswordLessUser)
}

export async function POST(request:Request){
    const data = await request.json()
    console.log(data)
    console.log("POST")
    return NextResponse.json({msg:"balls"})
}