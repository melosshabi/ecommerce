import { NextResponse } from "next/server"

export async function GET(req:Request){
    const data = req.json()
    const {username} = await data
    console.log(username)
    return NextResponse.json({msg:"balls"})
}

export async function POST(){
    console.log("POST")
    return NextResponse.json({msg:"balls"})
}