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

}, {
    timestamps:true
})

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel