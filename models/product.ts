import { ObjectId } from "mongodb";
import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
    posterDocId:{
        type: ObjectId,
        required:true
    },
    productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    productReviews:{
        type:Array,
        required:false,
    },
    quantity:{
        type:Number,
        required:true
    }
})

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema)

export default productModel