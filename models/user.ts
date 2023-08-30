import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
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
    dateAccountCreated:{
        type:Date,
        default: () => Date.now()
    },
    dateAccountUpdated:{
        type:Date,
        default: () => Date.now()
    }
})

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel