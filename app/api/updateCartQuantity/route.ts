import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
// Next Auth options
import {nextAuthOptions} from '../auth/[...nextauth]/options'

const quantityActions = {
    inc:'increment',
    dec:'decrement'
}

export async function PATCH(req:Request){
    const data = await req.json()
    console.log("Data", data)
    const session = await getServerSession(nextAuthOptions)
    // console.log("server Session:", session)
    if(data.userId !== session?.user.userId){
        return NextResponse.json({errorMessage:"Can't make requests on someone else's behalf"}, {status:400})
    }
    if(data.action === quantityActions.inc){
        const user = await userModel.findOne({userId:data.userId}).where({cart: { productDocId: data.productDocId}})
        console.log(user)
        // const cartItem = await userQuery.findOne({cart:{ $elemMatch: {productDocId:data.productDocId}}})
        
        return NextResponse.json({msg:'hi'})
    }
    return NextResponse.json({errorMessage:"Invalid data"}, {status:200})
}