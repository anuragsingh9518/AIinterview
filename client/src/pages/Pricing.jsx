import react, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react"
import axios from "axios"
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
function Pricing() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [selectedPlan,setSelectedPlan] = useState("free");
    const [loadingPlan,setLoadingPlan]= useState(null);
    const plans =[
        {
            id:"free",
            name:"Free",
            price:" ₹0",
            credits:100,
            description:"Perfect for bignners starting interview preparation.",
            features:[
                "100 Ai interview credits",
                "Basic performance feedback",
                "Voice interview mode ",
                "limited History  Report"
            ],
            default:true,
        },
        {
            id:"basic",
            name:"pro",
            price:"₹199",
            credits:150,
            description:"Ideal for students and early professionals seeking comprehensive feedback.",
            features:[
                "500 Ai interview credits",
                "Detailed performance analytics",
                "Voice and text interview modes",
                "Extended report history"
            ],
        },
        {
            id:"pro",
            name:"Pro pack",
            price:"₹499",
            credits:500,
            description:"Ideal for students and early professionals seeking comprehensive feedback.",
            features:[
                "500 Ai interview credits",
                "Detailed performance analytics",
                "Voice and text interview modes",
                "Extended report history",
                "skill trend Analysis"
            ],
            badge:"Best value"
        },
     ];


const handlePayment =async(plan)=>{
    try{
          setLoadingPlan(plan.id);

          const amount=
          plan.id==="basic"?199:
          plan.id==="pro"?499:0;

          const result = await axios.post(ServerUrl +"/api/payment/orders",{
            planId:plan.id,
            amount,
            credits:plan.credits,
          },{withCredentials:true})
          
           
          const options={
            key:import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount:result.data.amount,
            currency:"INR",
            name:"InterviewAI",
            description:`${plan.name}-${plan.credits} credits`,
            order_id:result.data.id,
            handler: async function(response){
                const verifypay =await axios.post(ServerUrl +"/api/payment/verify",
                    response,{withCredentials:true})
                    dispatch(setUserData(verifypay.data.user))
                    alert("payment Successful ,Credits Added!");
                    navigate("/")

                    

                // try{
                //     const verifyResult = await axios.post(ServerUrl + "/api/payment/verify",{
                //         razorpay_payment_id: response.razorpay_payment_id,
                //         razorpay_order_id: response.razorpay_order_id,
                //         razorpay_signature: response.razorpay_signature,
                //     },{ withCredentials: true });
                //     console.log("Payment verified:", verifyResult.data);
                //     alert("Payment successful! Credits added to your wallet.");
                //     navigate("/");
                // } catch(err){
                //     console.error("Payment verification failed:", err);
                //     alert("Payment verification failed. Please contact support.");
                // }
            },
            theme:{
                color:"#10b981"

            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open()
        setLoadingPlan(null);
    }catch(error){ 
        console.log(error)
        setLoadingPlan(null);
        
    }

}   
    return (
        <div className="min-h-screen bg-gradient-to-br from -gray-50 to-emerald-50
        py-16 px-6">
            <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="mt-2 p-3 rounded-full 
                bg-white shadow hover:shadow-md transition ">
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <div className="text-center w-full">
                    <h1 className="text-4xl font-bold  text-gray-800"> Choose your plan </h1>
                    <p className="text-gray-500 mt-3 text-lg">
                        Flexible plans to match your interview preparation  goals.
                    </p>
                </div>
            </div>
               

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan)=>{
                    const isSelected = selectedPlan === plan.id
                    return(
                        <motion.div key={plan.id}
                        whileHover={!plan.default && {scale:1.03}}
                        onClick={()=>!plan.default && setSelectedPlan(plan.id)}
                        className={`relative rounded-3xl p-8 transition-all duration-300
                         border
                        ${isSelected ? "border-emerald-600 bg-white shadow-2xl"
                         :"border-gray-200 bg-white shadow-md "
                        }
                         ${plan.default ? "cursor-default":
                            "cursor-pointer"}
                            `}>
                                {/*badge*/}
                                {plan.badge && (
                                    <div className="absolute top-6 right-6 bg-emerald-600 
                                    text-white text-xs px-4 py-1 rounded-full shadow ">
                                        {plan.badge}
                                    </div> 
                                )}
                                {/*default tag*/}
                                {plan.default && (
                                    <div className="absolute top-6 right-6 bg-gray-200
                                    text-gray-700 text-xs px-3 py-1 rounded-full  ">
                                        Default
                                        {plan.default}
                                    </div> 
                                )}
                                {/*price */}
                                <div className="mt-4">
                                    <span className="text-3xl font-bold  text-emerald-600">
                                        {plan.price}
                                        </span>
                                        <p className="text-gray-500 mt-1">
                                            {plan.credits} Credits
                                        </p>
                                </div>
                                {/*description */}
                                <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                                    {plan.description}
                                </p>
                                {/*features*/}
                                <div className="mt-6 spcae-y-3 text-left">
                                    {plan.features.map((features,i)=>(
                                        <div key={i} className="flex items-center gap-3">
                                            <FaCheckCircle className="text-emerald-500 text-sm"/>
                                            <span className="text-gray-700 text-sm">{features}</span>
                                            </div>
                                        ))}

                                </div>
                            { !plan.default &&
                            <button 
                            disabled = {loadingPlan=== plan.id}
                            onClick={(e)=>{e.stopPropagation()
                                if(!selectedPlan){
                                   setSelectedPlan(plan.id)
                                }else{
                                    handlePayment(plan)
                                }
                            }  }
                            
                            className={`w-full mt-8 py-3 rounded-xl font-semibold
                            transtion ${
                                isSelected
                                ?"bg-emerald-600 text-white hover:opacity-90 "
                                :"bg-gray-100 text-gray-700 hover:bg-emrald-50"
                            }`}>
                                {loadingPlan=== plan.id
                                ? "Processing..."
                                :isSelected
                                ? "Proceed to pay "
                                :"Selected plan"
                                }
                                
                            </button>}


                        </motion.div>

  
                    )

                })}
                
               </div>
        </div>
    )
}
export default Pricing;
