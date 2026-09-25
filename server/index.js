import express from "express"
import dotenv from "dotenv"
import fs from "fs"
import connectDb from "./config/connectDB.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
dotenv.config()

// Ensure upload folder exists (Bug #1 fix)
if (!fs.existsSync("public")) {
    fs.mkdirSync("public", { recursive: true });
}
 const app = express()
app.use(cors({
   origin:"https://aiinterview-client-gspe.onrender.com",
   credentials:true
}))


 app.use(express.json())
 app.use(cookieParser())
 app.use("/api/auth", authRouter)
 app.use("/api/user" , userRouter)
 app.use("/api/interview",interviewRouter)
 app.use("/api/payment",paymentRouter)
const port = process.env.PORT || 6000
 app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`)
    connectDb()
 })
