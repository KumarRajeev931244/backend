import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        // req have access of cookie by cookie parser
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("token:", token); // it will generate token
        
    
        if(!token){
            throw new ApiError(401, "unauthorized request")
        }
        
        // jiske pass access token hoga vahi use decode kar payga.
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user", user);
        
    
        if(!user){
            //TODO: discuss about frontend
            throw new ApiError(401, "invalid Access token")
        }
    
        req.user = user;
        next()
    } catch (error) {
            throw new ApiError(401, error?.message || "invalid access token")
        
    }

})