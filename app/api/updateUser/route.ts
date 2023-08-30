import connectToDb from "@/lib/mongodb"
import userModel from "@/models/user"
import { writeFile } from "fs/promises"
import { NextResponse } from "next/server"
import {join} from 'path'
import cloudinary from 'cloudinary'
import { unlink } from "fs/promises"

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export async function PATCH(req:Request, res:Request){
    const data = await req.formData()
    
    console.log("Profile picture file",data.get('profilePicture')?.valueOf())
    if(data.get('profilePicture')?.valueOf() !== undefined){
        const newProfilePicture: File = data.get('profilePicture') as unknown as File
        const bytes = await newProfilePicture.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const path = join(__dirname, '/../../../../../profilePictures', newProfilePicture.name)
        await writeFile(path, buffer)

        const cloudinaryRes = await cloudinary.v2.uploader.upload(path, {folder:'ecommerce/profilePictures', public_id:`ProfilePictureOf${data.get('userId')}`, overwrite:true})

        await connectToDb()
        await userModel.findOneAndUpdate({userId:data.get('userId')}, {
            username:data.get('newUsername'),
            email:data.get('newEmail'),
            profilePictureUrl:cloudinaryRes.url
        })
        await unlink(path)
    }else {
        await connectToDb()
        await userModel.findOneAndUpdate({userId:data.get('userId')}, {
            username:data.get('newUsername'),
            email:data.get('newEmail')
        }, {new:true})
    }
    
    return NextResponse.json({
        message:"Account updated",
        messageCode:"account-updated",
    }, {status:201})
}