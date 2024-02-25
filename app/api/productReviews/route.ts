import { NextResponse } from "next/server"
import productReviewModel from "@/models/productReview"
import { ObjectId } from "mongodb"
import connectToDb from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../auth/[...nextauth]/options"

type review = {
    posterDocId:string,
    productId:string,
    rating:string,
    reviewText:string,
}
export async function POST(req:Request){
    const session = await getServerSession(nextAuthOptions)

    if(!session){
        return NextResponse.json({error:"You need to sign in before posting reviews", errorCode:"unauthenticated"}, {status:400})
    }
    const data:review = await req.json()
    if(!parseInt(data.rating)){
        return NextResponse.json({errorMessage:"Rating should be a number", errorCode:"invalid-rating-data"}, {status:400})
    }
    
    try{
        await connectToDb()
        await productReviewModel.create({
            posterDocId:new ObjectId(data.posterDocId),
            productId:new ObjectId(data.productId),
            rating:parseInt(data.rating),
            reviewText:data.reviewText
        })
    }catch(dbRes:any){
        if(dbRes == "BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer"){
            return NextResponse.json({error:"Invalid ID"}, {status:400})
        }
        // First I'm checking if the database response contains an object named after a field in the productReviews model which contains the validation error and then im handling the error
        if(dbRes.errors){
            if(dbRes.errors.rating && dbRes.errors.rating.properties.message === 'max-rating-5'){
                return NextResponse.json({errorMessage:"Rating has to be a maximum value of 5", erroCode:"invalid-rating-value"}, {status:400})
            }else if(dbRes.errors.rating && dbRes.errors.rating.properties.message === 'min-rating-1'){
                return NextResponse.json({errorMessage:'Rating has to be a minimum value of 1', errorCode:"invalid-rating-value"}, {status:400})
            }else if(dbRes.errors.reviewText && dbRes.errors.reviewText.properties.message === 'review-too-short'){
                return NextResponse.json({errorMessage:"Your review has to be at least 10 characters long", errorCode:"invalid-review"}, {status:400})
            }else if(dbRes.errors.reviewText && dbRes.errors.reviewText.properties.message === 'review-too-long'){
                return NextResponse.json({errorMessage:"Your review has to be a maximum length of 500 characters", errorCode:"invalid-review"}, {status:400})
            }
        }
        return NextResponse.json({error:'error'})
    }
    return NextResponse.json({responseMessage:"Your review was posted successfully", responseCode:"review-posted"})
}