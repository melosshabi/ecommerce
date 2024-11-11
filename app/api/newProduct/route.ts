import connectToDb from "@/lib/mongodb"
import productModel from "@/models/product"
import { NextResponse } from "next/server"
import cloudinary from 'cloudinary'
import userModel from "@/models/user"
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

export async function POST(req:Request){
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const authorization = req.headers.get("Authorization")
        const token = authorization?.split(" ")[1]
        if(!token){
            return NextResponse.json({msg:'unauthenticated'}, {status:403})
        }
        const user = await decrypt(token)
        const data = await req.json()
        const pictureUrls = []
        // Uploading the pictures
        for(let i = 0; i < data.pictures.length; i++){
            const bytes = decodeBase64(data.pictures[i])
            const buffer = Buffer.from(bytes)
            const cloudinaryRes: any = new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder:'ecommerce/products', public_id:`Product${new Date()}`}, (err, res) => {
                    if(err){
                        console.log("ERR: ", err)
                        reject(err)
                    }
                    return resolve(res)
                }).end(buffer)
            })
            const {url} = await cloudinaryRes
            pictureUrls.push(url)
        }
        try{
            await connectToDb()
            const productDoc = await productModel.create({
                posterDocId: user._id,
                productName:data.productName,
                brandName:data.brandName,
                manufacturer: data.manufacturer,
                productPrice: data.productPrice,
                quantity: data.quantity,
                pictures: pictureUrls,
            })
            await userModel.findOneAndUpdate({_id:new ObjectId(user._id as string)}, {
                $push: {products: productDoc._id}
            })
            return NextResponse.json({msg:"product-uploaded"}, {status:201})
        }catch(err:any){
            return NextResponse.json({msg:"failed-to-upload-product"}, {status:500})
        }
        
    }

    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before posting a product", errCode:"unauthenticated"}, {status:400})
    }
    const data = await req.formData()
    const productName = data.get('productName')
    const brandName = data.get('brandName')
    const manufacturer = data.get('manufacturer')
    const productPrice = data.get('price')
    const quantity = data.get('quantity')
    const picture1: File = data.get('picture1') as unknown as File
    const picture2: File = data.get('picture2') as unknown as File
    const picture3: File = data.get('picture3') as unknown as File
    const pictures = [picture1, picture2, picture3]
    const pictureUrls: string[] = []

    if(!productName || !manufacturer || !productPrice || !quantity || picture1.valueOf() === undefined){
        return NextResponse.json({
            errorMessage:"Please fill out the form",
            errorCode:"incomplete-form"
        }, {status:400})
    }
    // Uploading the pictures to cloudinary
    for(let i = 0; i < pictures.length; i++){
        if(pictures[i].valueOf() !== 'undefined'){
            const bytes = await pictures[i].arrayBuffer()
            const buffer = Buffer.from(bytes)
            const cloudinaryRes: any = new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({folder:'ecommerce/products', public_id:`Product${new Date()}`}, (err, res) => {
                    if(err){
                        console.log("ERR: ", err)
                        reject(err)
                    }
                    return resolve(res)
                }).end(buffer)
            })
            const {url} = await cloudinaryRes
            pictureUrls.push(url)
        }
    }

    try{
        await connectToDb()
        const productDoc = await productModel.create({
            posterDocId: session.user.userDocId,
            productName,
            brandName:brandName,
            manufacturer,
            productPrice,
            quantity,
            pictures:pictureUrls,
        })
        await userModel.findOneAndUpdate({_id:new ObjectId(session.user.userDocId)}, {
            $push: {products: productDoc._id}
        })
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