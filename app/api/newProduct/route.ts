import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import { NextResponse } from "next/server"
import cloudinary from 'cloudinary'
import { unlink, writeFile } from "fs/promises"
import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import path from "path"

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export async function POST(req:Request){
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before posting a product", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.formData()
    const userDocId = data.get('userDocId')
    const productName = data.get('productName')
    const brandName = data.get('brandName')
    const noBrand = data.get('noBrand')
    const manufacturer = data.get('manufacturer')
    const productPrice = data.get('price')
    const quantity = data.get('quantity')
    const picture1: File = data.get('picture1') as unknown as File
    const picture2: File = data.get('picture2') as unknown as File
    const picture3: File = data.get('picture3') as unknown as File
    const pictures = [picture1, picture2, picture3]
    const picturesUrls: string[] = []

    if(!productName || noBrand === 'false' && !brandName || !manufacturer || !productPrice || !quantity || picture1.valueOf() === undefined){
        return NextResponse.json({
            errorMessage:"Please fill out the form",
            errorCode:"incomplete-form"
        }, {status:400})
    }

    // Uploading pictures to cloudinary
    for(let i = 0; i < pictures.length; i++){
        if(pictures[i].valueOf() !== 'undefined'){
            const tempPath = path.join(process.cwd(), `/tmp/${pictures[i].name}`)
            const bytes = await pictures[i].arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(tempPath, buffer)
            const cloudinaryRes = await cloudinary.v2.uploader.upload(tempPath, {folder:'ecommerce/products', public_id: `Product${new Date()}`})
            picturesUrls.push(cloudinaryRes.url)
            await unlink(tempPath)
        }
    }

    try{
       await connectToDb()
       if(noBrand === 'true'){
         const productDoc = await productModel.create({
             posterDocId: userDocId,
             posterUsername:session.user.name,
             productName,
             noBrand,
             manufacturer,
             productPrice,
             quantity,
             pictures:picturesUrls,
        })

        await userModel.findOneAndUpdate({userId:data.get('userId')}, {
         $push: {products: productDoc._id}
        })
       }else{
       const productDoc = await productModel.create({
            posterDocId: userDocId,
            posterUsername:session.user.name,
            productName,
            brandName,
            noBrand,
            manufacturer,
            productPrice,
            quantity,
            pictures:picturesUrls,
       })

       await userModel.findOneAndUpdate({userId:data.get('userId')}, {
        $push: {products: productDoc._id}
       })
    }

    }catch(err:any){
        console.log(err)
        if(err._message === 'Product validation failed'){
            return NextResponse.json({
                errorMessage:"Please fill out the form",
                errorCode:"incomplete-form",
            }, {status:400})
        }
    }

    return NextResponse.json({
        message:"Product posted successfully",
        messageCode:"product-created",
    }, {status:201})
}