// import connectToDb from "@/lib/mongodb"
// import User from "@/models/user"
// import { NextResponse } from "next/server"
// import hashPassword from "@/lib/hashPassword"
// import { nanoid } from 'nanoid'

// export async function POST(req:Request, res:Response){
//     const {username, email, password} = await req.json()

//     const hashedPassword = await hashPassword(password)
//     await connectToDb()
//     await User.create({userId:nanoid(),username, email, password:hashedPassword, dateAccountCreated: new Date()})
//     return NextResponse.json({message:"Account Created"}, {status:201})
// }

// import NextAuth from "next-auth";
// import { nextAuthOptions } from "./options";

// const handler = NextAuth(nextAuthOptions)

// export {handler as GET, handler as POST}