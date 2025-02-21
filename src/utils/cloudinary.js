import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// cloudinary  configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


/**
 * check local path if not return null
 * upload the file on cloudinary
 */

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log(`response: ${response}`);
        

        // file uploaded successfully
        console.log(`file is uploaded on cloudinary:${response.url}`);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved tempory file as the upload operation is failed.
        
        return null
        
    }
}

export {uploadOnCloudinary}