import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    // phele hum user ki information lenge.

    const {username, email, password, fullname} = req.body
    // phir check koi field empty toh nahi hai

    if(
        [username, email, password, fullname].some((field) => {
            field?.trim() === ""
        })
    ){
        throw new ApiError(400, "all field are required")
    }
    // phir check karege voh user hamare database exist toh nahi karta

    const existedUser = await User.findOne({
        $or:[{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(400, "user already exist")
    }
    // phir avatar aur coverImage lenge

    const avatarLocalPath = req?.files?.avatar[0]?.path
    const coverImageLocalPath = req?.files?.coverImage[0]?.path
    // avatar image is compulsory
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is compulsory")
    }


    // upload karenge cloudinary pe avatar aur coverImage
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // phir check karenge image successfully upload ho gya
    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }
    // user create karenge data base mae
    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    // check kerenge user create ho gya
    if(!createdUser){
        throw new ApiError(400, "something went wrong while creating user")
    }
    // phir res send kat
    return res
    .status(201)
    .json(
        new ApiResponse(200,
            createdUser,
            "user created successfully"
        )
    )
})

const loginUser = asyncHandler(async(req, res) => {
    // phele hum request body se username,email aur password.
    // kam se kam ek element match karna chaiye
    // voh user database mae exist karta hai
    // password check karenge
    // refresh token check karenge

    const {username, email, password} = req.body

    if(!(username || email)){
        throw new ApiError(401, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "invalid credential")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password  -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser,
                accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )


})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },{
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "user logout successfully"))

})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
})


export {
    registerUser,
    loginUser
}