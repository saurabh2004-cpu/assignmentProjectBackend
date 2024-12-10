import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJwt =  async (req, _ ,next)=>
{
    
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new error("Token not found")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new error("User not found")
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new error(error.message)
    }

}


