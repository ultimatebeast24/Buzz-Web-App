import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        
        //trying to signup a new user
        if (password !== confirmPassword) {
            return res.status(400).json({message: "Passwords don't match",})
        }

        const user = await User.findOne({username});
        if (user) {
            return res.status(400).json({message: "Username already exists",})
        }

        //HASH PASSWORD HERE 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword, //saving a hashed password for security
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
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
            res.send(400).json({ message: "User creation failed", });
        }
    } catch (error) {
        console.log("Error signing up:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials", });
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
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
};
