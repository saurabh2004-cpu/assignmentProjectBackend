import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJwt =  async (req, _ ,next)=>
{
    
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw error("Access token not found")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw error("User not found")
        }
    
        req.user=user;
        next()
    } catch (error) {
       throw error(error.message)
    }

}


