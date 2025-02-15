
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';



const registerUser = asyncHandler(async (req, res) => {
    // get user detail from the frontend.
    // validation - not empty
    // check if user already exist : username or email
    // check for images, check for avatar
    // upload  them on cloudinary, avatar 
    // create user object - creation entry in db
    // remove the password and the refresh token field from response
    // check for user creation
    // return res
    const {fullname, email, username, password} =  req.body

    // if(fullname === ""){ 
    //     throw new ApiError(400, "full name is required")
    // }

    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all field are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    console.log(`existed user: ${existedUser}`);
    

    if(existedUser){
        throw new ApiError(400, "user already exist")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // console.log(req.files)
    const coverImageLocalPath =  req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await  uploadOnCloudinary(avatarLocalPath)
    const coverImage = uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.tolowerCase()
    })
    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while created user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user register successfully")
    )
})

export  {registerUser}