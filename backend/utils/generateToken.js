import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //in milliseconds
        httpOnly: true, //prevents XSS attacks cross-site scripting attacks( avaoid aceesing using js)
        sameSite: "strict", //prevent CSRF
        secure: process.env.NODE_ENV === "development" ? false : true,
    });

    return token;
};
export default generateTokenAndSetCookie;