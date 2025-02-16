import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async(req, res) => {

    
    // get user detail from the frontend.
    // validation - not empty
    // check if user already exist : username or email
    // check for images, check for avatar
    // upload  them on cloudinary, avatar 
    // create user object - creation entry in db
    // remove the password and the refresh token field from response
    // check for user creation
    // return res
    console.log("request body:", req);
    
    const {fullname, email, username, password} = req.body

    // if(fullname === ""){ 
    //     throw new ApiError(400, "full name is required")
    // }

    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all field are required")
    }
    
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(`existed user: ${existedUser}`);
    

    if(existedUser){
        throw new ApiError(400, "user already exist")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    console.log(`avtar local path: ${avatarLocalPath}`);
    console.log(`full name: ${fullname}`);
    console.log(`email: ${email}`);
    console.log(`username: ${username}`);
    
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log(`cover image local path: ${coverImageLocalPath}`);
    

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await  uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
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

// const registerUser = asyncHandler(async (req, res) => {
//     // get user details from frontend.
//     // validation -not empty
//     // check if user already exists: username, email
//     // check for images, checks for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db
//     // remove password and refreshtoken field from response
//     // check for user creation
//     // return res

//     console.log("request:", req.body);


    
// })

export  {registerUser}