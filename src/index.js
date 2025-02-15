import dotenv from 'dotenv'
import connectDB from './db/index.js'
// import express from 'express'
import { app } from './app.js'

// const app = express()

dotenv.config({
    path: './env'
})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`);
        
    })
} )
.catch((error) => {
    console.log(`mongodb connection failed !!!`, error);  
})



















/** 

const app = express()

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log(`express error:${error}`);
            throw error
            
        })

        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log(`mongodb connection error:${error}`);
        throw error
        
        
    }
})()
*/