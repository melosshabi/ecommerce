import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    userId:String,
    username:String,
    email:String,
    password: String,
    dateAccountCreated:Date
})

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User