import { ObjectId } from "mongodb"
import mongoose, {Schema} from "mongoose"

const productReviewSchema = new Schema({
    posterDocId:{
        type:ObjectId,
        required:true,
    },
    productId:{
        type:[ObjectId, "Invalid Id"],
        required:true,
    },
    rating:{
        type:Number,
        min:[1, 'min-rating-1'],
        max:[5, "max-rating-5"],
        required:true
    },
    reviewText:{
        type:String,
        minLength:[10, "review-too-short"],
        maxLength:[500, "review-too-long"],
        required:true
    },
    datePosted:{
        type:Date,
        required:false,
        default:() => Date.now()
    }
})

const productReviewModel = mongoose.models.ProductReview || mongoose.model("ProductReview", productReviewSchema)
export default productReviewModel