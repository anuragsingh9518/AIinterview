import React from 'react'
import { RiRobot3Line } from "react-icons/ri";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion, scale } from "motion/react"
import {  signInWithPopup} from 'firebase/auth';
import { auth, provider } from '../utills/firebase';
import { ServerUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Auth = ({isModel=false}) => {
    const dispatch = useDispatch()
    const handleGoogleAuth =async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {email,name},{withCredentials:true })
           dispatch(setUserData(result.data))
            
        } catch (error) 
        {
            
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);
    dispatch(setUserData(null))
            
        }
        
    }
    
  return (
<div className= {` w-full
    ${isModel? "py-4 ": "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}`}>
    <motion.div
    initial={{opacity:0 ,  y:-40}}
    animate={{ opacity:1,y:0}}
    transition={{duration:1.05}}
     className={` max-w-md
    ${isModel? "max-w-md p-8 rounded-3xl":"max-w-lg p-12 rounded-[32px]"}
    bg-white shadow-2xl border border-gray-200
    `}
    >
        <div className='flex items-center justify-center gap-3 mb-6'>
            <div  className='bg-black text-white rounded-lg p-2'>
                <RiRobot3Line size={18} />
            </div>
            <h2> InterviewIQ.AI</h2>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snugmb-4'> Continue with 
             <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
            <IoSparkles  size={16}/>
            AI smart interview
        </span>
        </h1>
        <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
            Sign in to start AI powered mock interview ,track your process,and unlock detailed performance insights.
        </p>
        <motion.button 
        onClick={handleGoogleAuth}
        whileHover={{opacity:0.9, scale:1.03}}
        whileTap={{opacity:1, scale:0.98}}
        className='w-full flex items-center justify-center gap-3  py-2 bg-black text-white rounded-full
        shadow-md'>
            <FcGoogle size={20}/>
            Continue with google
        </motion.button>
       
    </motion.div>
   </div>
  )
}

export default Auth