import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    userId:String,
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