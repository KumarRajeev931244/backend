import mongoose from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true         // this will help in searching in db.
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true

    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        required: true,

    },
    coverImage:{
        type: String,
        
    },
    password:{
        type: String,
        required: [true, "password is required"]
    },
    refreshToken:{
        type: String
    }
}, {timestamps: true})


// here password is encyrpt
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// here password is check 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
    
}

// generating access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generating refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model("User", userSchema)