import connectToDb from "@/lib/mongodb"
import userModel from "@/models/user"
import { writeFile } from "fs/promises"
import { NextResponse } from "next/server"
import {join} from 'path'
import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export async function PATCH(req:Request, res:Request){
    const data = await req.formData()
    const newProfilePicture: File | null = data.get('profilePicture') as unknown as File

    const bytes = await newProfilePicture.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const path = join('/', 'test', newProfilePicture.name)
    await writeFile(path, buffer)
    await cloudinary.uploader.upload(path, {folder:'/ecommerce/profilePictures'})
    console.log(`open ${path} to see the file`)
    // await connectToDb()
    // const updatedUser = await userModel.findOneAndUpdate({userId:data.userId}, {
    //     username:data.newUsername,
    //     email:data.newEmail
    // }, {new:true})

    // console.log(updatedUser)

    return NextResponse.json({
        message:"Account updated",
        messageCode:"account-updated",
    }, {status:201})
}