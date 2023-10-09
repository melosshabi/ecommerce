
import { ObjectId } from "mongodb";
import mongoose, {Schema} from 'mongoose'

const orderSchema = new Schema({
    clientDocId:{
        type:ObjectId,
        required:true
    },
    productDocId:{
        type:ObjectId,
        required:true
    },
    desiredQuantity:{
        type:Number,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    orderPrice:{
        type:Number,
        required:true
    },
    cardNumber:{
        type:String,
        required:true
    },
    expirityMonth:{
        type:String,
        required:true
    },
    expirityYear:{
        type:String,
        required:true
    },
    cvv:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    billingAddress:{
        type:String,
        required:true
    },
    billingAddress2:{
        type:String,
        required:false
    },
    phoneNumber:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zipCode:{
        type:String,
        required:true
    },
    timeOrderPlaced:{
        type:Date,
        required:false,
        default:() => Date.now()
    }
})

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default orderModel