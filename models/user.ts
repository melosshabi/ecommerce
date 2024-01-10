import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        lowerCase:true
    },
    email:{
        type:String,
        required:true,
        lowerCase:true
    },
    password:{
        type:String,
        required:true
    },
    profilePictureUrl:{
        type:String,
        required:false,
        default:() => ""
    },
    reviews:{
        type:Array,
        required:false,
        default: () => []
    },
    products:{
        type:Array,
        required:false,
        default: () => []
    },
    cart:{
        type:Array,
        required:false,
        default:() => []
    },
    wishlist:{
        type:Array,
        required:false,
        default: () => []
    },
    orders:{
        type:Array,
        required:false,
        default:() => []
    },
    dateAccountCreated:{
        type:Date,
        required:false,
        default: () => Date.now()
    },
    dateAccountUpdated:{
        type:Date,
        required:false,
        default: () => Date.now()
    }
})

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel