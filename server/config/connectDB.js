import mongoose from "mongoose";
const connectDb= async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected")
    } catch (error) {
        console.log(`the database is not connected ${error}`)
    }
    
}
export default connectDb