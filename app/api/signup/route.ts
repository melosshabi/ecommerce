import connectToDb from "@/lib/mongodb"
import { hashPassword } from "@/lib/bcrypt"
import userModel from "@/models/user"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(req:Request){
    const data = await req.json()

    await connectToDb()

    // I used this variable to check if the sent username already exists

    const user = await userModel.findOne({username:data.username})
    if(user){
        return NextResponse.json({
            errorMessage:"This username is already taken",
            errorCode:"username-taken"
        }, {status:400})
    }

    const hashedPassword = await hashPassword(data.password)
    const userId = nanoid()

    let newUser
    try{
        newUser = await userModel.create({...data, password:hashedPassword, userId})
    }catch(err:any){
        if(err._message === "User validation failed"){
            return NextResponse.json({
                errorMessage:"Please fill out the form",
                errorCode:"incomplete-form"
            }, {status:400})
        }
    }
        const passwordLessUser = {
            ...newUser._doc
        }
        delete passwordLessUser.password

        return NextResponse.json({
        message:"Account createdSucessfully",
        messageCode:"account-created",
        user:passwordLessUser
    })
}
