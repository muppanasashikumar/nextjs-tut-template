import mongoose from "mongoose";

export const connectMongoDB = async() => {
    try {
        let res = await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connection Successful!')
        return true
    } catch (error) {
        console.error('Connection Error',error)
        process.exit(1)
    }
}