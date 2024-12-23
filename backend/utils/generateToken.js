import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "45d",
    });

    res.cookie("jwt", token, {
        maxAge: 45 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevents XSS attacks cross-site scripting attacks( avaoid aceesing using js)
        sameSite: "strict", //prevent CSRF
        secure: process.env.NODE_ENV === "development" ? false : true,
    });
};

export default generateTokenAndSetCookie;