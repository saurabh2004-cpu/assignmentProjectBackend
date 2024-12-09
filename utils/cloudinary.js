import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'   //file system

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgsvoeqsl',
    api_key: process.env.CLOUDINARY_API_KEY  || '635435151655556',
    api_secret: process.env.CLOUDINARY_API_SECRET || '-U_oEauANmOtbiLj_EONTYt7vCM'
});

const uploadOnCloudinary = async (localFilePath) => {

    console.log("cloudinary file", localFilePath)

    
    try {

        if (!localFilePath) return null

        //file upload on cloudinary
        const response = await cloudinary.uploader
            .upload(
                localFilePath,
                {
                    resource_type: "auto"
                })

            .catch((error) => {
                console.log(error.message);
            })

        console.log('file is uploaded on cloudinary ', response.url)
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("error", error)
        fs.unlinkSync(localFilePath) //remove the locally saved temporry file as the upload operation got failed 
        return null
    }

}

export { uploadOnCloudinary }