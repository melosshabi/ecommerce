import mongoose from 'mongoose'

const connectToDb = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI as string)
        console.log("Connected to db")
    }catch(err){
        console.log(err)
    }
}

export default connectToDb