import { ObjectId } from "mongodb"
import mongoose, {Schema} from 'mongoose'

const orderSchema = new Schema({
    clientDocId:{
        type:ObjectId || null,
        required:false
    },
    productsOrdered:{
        type:Array,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
})

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default orderModel