import connectToDb from "@/lib/mongodb"
import userModel from "@/models/user"
import { NextResponse } from "next/server"
import cloudinary from 'cloudinary'
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import { decrypt } from "@/lib/authLib"
import { ObjectId } from "mongodb"
import { decode as decodeBase64 } from "base64-arraybuffer"

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export async function PATCH(req:Request){
    const mobile = req.headers.get("Mobile")    
    if(mobile){
        const data = await req.formData()
        const session = req.headers.get("Authorization")
        const token = session?.split(" ")[1]
        if(token){
            const user = await decrypt(token)
            if(!data.get('username') || !data.get('email')){
                return NextResponse.json({errMsg:"fields-cannot-be-empty"}, {status:400})
            }
            const newProfilePicture = data.get("profilePicture") as string
            if(newProfilePicture){
                const bytes = decodeBase64(newProfilePicture)
                const buffer = Buffer.from(bytes)
                await new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream({folder:'ecommerce/profilePictures', public_id:`ProfilePictureOf${user._id}`}, (err, res) => {
                        if(err){
                            console.log("ERR: ", err)
                            reject(err)
                        }
                        return resolve(res)
                    }).end(buffer)
                }).then(async (res:any) => {
                    await connectToDb()
                    await userModel.findOneAndUpdate({_id:new ObjectId(user._id as string)}, {
                        profilePictureUrl:res.url
                    })
                })
                return NextResponse.json({msg:'profile-updated'})
            }
            await connectToDb()
            await userModel.findOneAndUpdate({_id:new ObjectId(user._id as string)}, {
                username:data.get('username'),
                email:data.get('email'),
            })
            
            return NextResponse.json({msg:'profile-updated'})
        }
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before making changes to your profile", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.formData()
    if(data.get('profilePicture')?.valueOf() !== undefined){
        const newProfilePicture: File = data.get('profilePicture') as unknown as File
        const bytes = await newProfilePicture.arrayBuffer()
        const buffer = Buffer.from(bytes)
        new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({folder:'ecommerce/profilePictures', public_id:`ProfilePictureOf${session.user.userDocId}`}, (err, res) => {
                if(err){
                    console.log("ERR: ", err)
                    reject(err)
                }
                return resolve(res)
            }).end(buffer)
        }).then(async (res:any) => {
            await connectToDb()
            await userModel.findOneAndUpdate({userId:data.get('userId')}, {
                username:data.get('newUsername'),
                email:data.get('newEmail'),
                profilePictureUrl:res.url
            }, {new:true})
        })
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