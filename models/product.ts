import { ObjectId } from "mongodb";
import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
    posterDocId:{
        type: ObjectId,
        required:true
    },
    posterUsername:{
        type:String,
        required:false
    },
    productName:{
        type:String,
        required:true
    },
    brandName:{
        type:String,
        required:false
    },
    manufacturer:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    pictures:{
        type:[{type:String}],
        required:true
    },
    productReviews:{
        type:Array,
        required:false,
        default: () => []
    },
}, {
    timestamps:true
})

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema)

export default productModel