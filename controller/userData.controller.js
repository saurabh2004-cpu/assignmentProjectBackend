import UserData from "../models/userData.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

const createUserData = async (req, res) => {

    const { username, lastName } = req.body
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized request" });
    }

    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'secret');
    const userId = decodedAccessToken._id

    if ([username, lastName].some((field) => field?.trim() === "")) {
        return res.status(400).json({
            message: "all fields are required"
        })
    }

    const userImageLocalPath = req.files.userImage[0].path;
    // console.log("userdata",username,lastName,userImageLocalPath);

    if (!userImageLocalPath) {
        throw new Error("User image is required")
    }

    const cloudinaryImageUrl = await uploadOnCloudinary(userImageLocalPath)

    if (!cloudinaryImageUrl) {
        return res.status(400).json({
            message: "User image upload failed"
        })
    }

    try {
        const userData = await UserData.create({
            username,
            lastName,
            userImage: cloudinaryImageUrl?.url || '',
            user: userId
        });

        if (!userData) {
            return res.status(400).json({
                message: "User data creation failed"
            })
        }

        return res.status(200).json({ message: "User data created successfully", userData });
    } catch (error) {
        console.error("Error creating user data:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getUserData = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'secret');

        console.log("decodedAccessToken", decodedAccessToken._id);
        const userId = decodedAccessToken._id;

        const userData = await UserData.findOne({ user: userId });

        console.log("userdata", userData);

        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }

        return res.status(200).json({ message: "User data fetched successfully", userData });
    } catch (error) {
        console.error("Error getting user data:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateUserData = async (req, res) => {
    try {
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const userData = await UserData.findOne({ user: userId });

        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }

        const { username, lastName } = req.body;

        if ([username, lastName].some((field) => field?.trim() === "")) {
            return res.status(400).json({
                message: "all fields are required"
            })
        }

        userData.username = username;
        userData.lastName = lastName;

        await userData.save();

        return res.status(200).json({ message: "User data updated successfully", userData });
    } catch (error) {
        console.error("Error updating user data:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateUserImage = async (req, res) => {
    try {
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const userData = await UserData.findOne({ user: userId });

        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }

        const newUserImageLocalPath = req.file.path;

        if (!newUserImageLocalPath) {
            return res.status(400).json({
                message: "User image is required"
            });
        }

        const cloudinaryImageUrl = await uploadOnCloudinary(newUserImageLocalPath);

        if (!cloudinaryImageUrl) {
            return res.status(400).json({
                message: "User image upload failed"
            });
        }

        userData.userImage = cloudinaryImageUrl?.url || '';

        await userData.save();

        return res.status(200).json({ message: "User image updated successfully", userData });
    } catch (error) {
        console.error("Error updating user image:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUserData = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log("accessToken", accessToken);

        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'secret');
        console.log("decodedAccessToken", decodedAccessToken._id);        

        const user = await User.findById(decodedAccessToken._id);
        console.log("user", user);

        if (!user) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const userData = await UserData.findOneAndDelete({ user: user._id });

        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }


        return res.status(200).json({ message: "User data deleted successfully" });
    } catch (error) {
        console.error("Error deleting user data:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export {
    createUserData,
    getUserData,
    updateUserData,
    updateUserImage,
    deleteUserData
}