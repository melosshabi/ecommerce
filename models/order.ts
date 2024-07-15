import { ObjectId, Timestamp } from "mongodb"
import mongoose, {Schema} from 'mongoose'

const orderSchema = new Schema({
    clientDocId:{
        type:ObjectId || null,
        required:false
    },
    productDocId:{
        type:ObjectId,
        required:true
    },
    desiredQuantity:{
        type:Number,
        required:true,
    },
    productPrice:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    }
    
}, {
    timestamps:true
})

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default orderModel