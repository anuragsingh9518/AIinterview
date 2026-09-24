import axios from "axios"
// import { response } from "express";
export const askAi = async(messages) => {
    try {
        if(!messages || !Array.isArray(messages) || messages.length 
    === 0){
        throw new Error("message array is empty");
    } 
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
        {
            model:"openai/gpt-4o-mini",
            messages:messages
        },
      {  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
     'Content-Type': 'application/json',
  },});
  const Content = response?.data?.choices?.[0]?.message?.content;
  if(!Content || !Content.trim()){
    throw new Error ("AI returened empty response.")
  }
  return Content 
    } catch (error){
        // Re-throw original error to preserve API error details (Bug #4 fix)
        console.error("OpenRouter error " ,error.response?.data ||
            error.message);
            throw error;
        
    }
}