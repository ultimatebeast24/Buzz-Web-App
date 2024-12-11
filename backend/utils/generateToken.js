import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", //prevent CSRF
        secure: process.env.NODE_ENV === "development" ? false : true,
    });
};

export default generateTokenAndSetCookie;