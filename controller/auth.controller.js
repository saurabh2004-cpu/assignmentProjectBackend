import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const hello = async (req, res) => {
    const word = "hello word"

    return res.status(200).json({
        message: word
    })
}

const generateAccessTokens = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()

        return accessToken
    } catch (error) {
        throw new Error(error.message)
    }

}

//signup user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    try {

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        if ([username, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({
                message: "all fields are required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        if (!user) {
            return res.status(400).json({
                message: "Error while registering user"
            })
        }

        const accessToken = await generateAccessTokens(user._id)

        const options = {
            httponly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000  //1d
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                message: "User created successfully",
                user
            })

    } catch (error) {
        console.error("Error during user registration:", error.message);
        return res
            .status(500).json({ message: "Internal server error" })
    }
}

//user login
const loginUser = async (req, res) => {
    const { email, password } = req.body

    if ([email, password].some((field) => field?.trim() === "")) {
        return res.status(400).json({
            message: "all fields are required"
        })
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }

        // generate access and refresh tokens 
        const accessToken = await generateAccessTokens(user._id)

        const options = {
            httponly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000  //1d
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                message: "User logged in successfully",
                user
            })

    } catch (error) {
        console.error("Error during user login:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Logout User
const logoutUser = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .json({ message: "User logged out successfully" })

    } catch (error) {
        console.error("Error during user logout:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


//get current user
const getCurrentUser = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            console.error("acesstoken not found");
        }

        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'secret');
        if (!decodedAccessToken) {
            console.error("decodedAccessToken not found");
        }

        const user = await User.findById(decodedAccessToken._id);
        if (!user) {
           console.error("user not found");
        }

        return res.status(200).json({ message: "Current user fetched successfully", user });
    } catch (error) {
        console.error("Error getting current user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const googleCallback = async (req, res) => {
    try {
        // console.log("req.user",req.user);
        const accessToken = await generateAccessTokens(req.user._id);

        const options = {
            httpOnly: true,
            secure: true, // Use `true` if you're using HTTPS
        };

        // Send tokens via cookies or JSON response
        res
            .cookie('accessToken', accessToken, options)
            .redirect(`https://assignment-project-frontend-cbs5.vercel.app/dashboard?token=${accessToken}`)
    }catch (error) {
        console.error("Error during Google callback:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}



export {
    hello,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    googleCallback
}