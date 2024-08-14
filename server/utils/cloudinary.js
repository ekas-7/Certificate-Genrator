const cloudinary = require("cloudinary").v2;
const fs = require('fs').promises;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_PASS
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the JPG file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            format: "jpg" 
        });

        // File has been uploaded successfully
        console.log("File is uploaded on Cloudinary:", response.secure_url);

        // Remove the locally saved temporary file after successful upload
        await fs.unlink(localFilePath);

        return response;

    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);

        // Remove the locally saved temporary file as the upload operation failed
        try {
            await fs.unlink(localFilePath);
        } catch (unlinkError) {
            console.error('Error removing local file:', unlinkError);
        }

        // Return null in case of error
        return null;
    }
};

module.exports = uploadOnCloudinary;
