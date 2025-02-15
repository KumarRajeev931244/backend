
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler( async(req, res) => {
    // get data from user
    // validation
    // check if user already exist: username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token filed from response
    // check for user creation
    // return res

    const {fullname, email, username, password} = req.body
    console.log("email:", email);

    // if(fullname === ""){
    //     throw new ApiError(400, "full name is required")
    // }
    
    if(
        [fullname, username, password, email].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all field are required")
    }

    const existedUser = User.findOne({
       $or: [{username}, {email}] 
    })
    if(existedUser){
        throw new ApiError(409, "user with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )







})

export  {registerUser}