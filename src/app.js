import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()


// app.use is used when we use middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// it will convert into json format.
app.use(express.json({limit: "16kb"}))

// it will convert url encoded form
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// it help in storing file in public file
app.use(express.static("public"))

// it will help in access and setting in cookie
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'


/**   routes declaration  */

app.use("/api/v1/users", userRouter)

//  http://localhost:8000/api/v1/users/register


export {app}