import mongoose from "mongoose";

const paymentSchema  = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    planId:String,
    amount: Number,
    credits: Number,
    razorpayOrderId:String,
    razorpayPaymentId:String,
    status:{
        type:String,
        enum:["created", "paid", "failed"],
        default:"created",
    }
},{timestamps: true})

const payment = mongoose.model("payment",paymentSchema);
export default payment;