import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrrentUser } from "../controllers/user.controller.js"

 const userRouter = express.Router()
 userRouter.get("/current-user",isAuth,getCurrrentUser)

 export default userRouter
