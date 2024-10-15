import connectToDb from "@/lib/mongodb"
import { hashPassword } from "@/lib/bcrypt"
import userModel from "@/models/user"
import { NextResponse } from "next/server"
import { encrypt } from "@/lib/authLib"

export async function POST(req:Request){
    const data = await req.json()
    await connectToDb()

    // I used this variable to check if the sent username already exists
    const user = await userModel.findOne({username:data.username})
    // I used this variable to check if the sent email already exists
    const userByEmail = await userModel.findOne({email:data.email})

    if(user && user._doc.username === data.username){
        return NextResponse.json({
            errorMessage:"This username is already taken",
            errorCode:"username-taken"
        }, {status:400})
    }
    if(userByEmail && userByEmail._doc.email === data.email){
        return NextResponse.json({
            errorMessage:"This email is already in use",
            errorCode:"email-taken"
        }, {status:400})
    }

    const hashedPassword = await hashPassword(data.password)
    const mobile = req.headers.get('Mobile')
    try{
        const newUser = await userModel.create({...data, password:hashedPassword})
        if(mobile){
            const {_id, username, email, profilePictureUrl} = newUser._doc
            const session = await encrypt({_id, username, email, profilePictureUrl})
            return NextResponse.json({session})
        }
        const passwordLessUser = {
            ...newUser._doc
        }
        delete passwordLessUser.password

        return NextResponse.json({
        message:"Account Created Sucessfully",
        messageCode:"account-created",
        user:passwordLessUser
    })
    }catch(err:any){
        console.log(err)
        if(err._message === "User validation failed"){
            return NextResponse.json({
                errorMessage:"Please fill out the form",
                errorCode:"incomplete-form"
            }, {status:400})
        }
    }
}