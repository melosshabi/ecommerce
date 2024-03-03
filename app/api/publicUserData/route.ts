import userModel from "@/models/user"
import { NextResponse } from "next/server"

export async function GET(req:Request){
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get('_id')
    if(userId?.toString()){
        const dbUserData = await userModel.findOne({_id:userId.toString()})
        return NextResponse.json({username:dbUserData.username, profilePicture:dbUserData.profilePictureUrl, userDocId:dbUserData._id})
    }else{
        return NextResponse.json({errorMessage:"An User ID is required"}, {status:400})
    }
}