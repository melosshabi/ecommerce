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
    firstName:{
        type:String,
        // required:true
    },
    lastName:{
        type:String,
        // required:true
    },
    billingAddress:{
        type:String,
        // required:true
    },
    billingAddress2:{
        type:String,
        required:false
    },
    phoneNumber:{
        type:String,
        // required:true
    },
    city:{
        type:String,
        // required:true
    },
    zipCode:{
        type:String,
        // required:true
    },
    
})

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default orderModel