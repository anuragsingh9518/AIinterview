import react, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react"
function Pricing() {
    const navigate = useNavigate()
    const [selectedPlan,setSelectedPlan] = useState();
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
            price:"₹99",
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
                            <button className={`w-full mt-8 py-3 rounded-xl font-semibold
                            transtion ${
                                isSelected
                                ?"bg-emerald-600 text-white hover:opacity-90 "
                                :"bg-gray-100 text-gray-700 hover:bg-emrald-50"
                            }`}>
                                {
                                    isSelected? "Proceed to pay ":"Selected plan"
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
