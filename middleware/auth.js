const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {authError} = require("../error");

const auth = (req, res, next) =>{
    //header 
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new authError("Invalid Authentication");
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // we can add user to req this way too
        // const user = await User.findById(payload.id).select("-password");//dropping password since we don't need it anymore
        // req.user = user;
        req.user = {userId: payload.userId, name: payload.name};
        next();
    } catch (error) {
        throw new authError("Invalid Authentication");
    }
}

module.exports = auth;