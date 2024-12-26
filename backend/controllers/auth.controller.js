import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import generateTokenAndSetCookie from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, username, password } = req.body;
    try {
        if(!fullName || !username || !password) {
            return res.status(400).json({ message: "All fields are required", });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Passwords must be atlest 6 characters", });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({message: "Username already exists",})
        }

        //HASHED THE PASSWORD 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword, //saving a hashed password for security
        });

        if (newUser) {
            //generate JWT token here
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save(); //saving newuser to the database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            }); //succefull created
        } else {
            res.send(400).json({ message: "Invalid Userdata,creation failed", });
        }
    } catch (error) {
        console.log("Error signing up:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials", });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials", });
        }
        generateTokenAndSetCookie(user._id, res);
        //after successfully logging in, we want to return the user's data , excluding the pass.
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
        
    } catch (error) {
        console.log("Error logining up:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const logout = (req, res) => {
        try {
            res.cookie("jwt", "", { maxAge: 0 });
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.log("Error logging out:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
      res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
