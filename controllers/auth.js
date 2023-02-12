const {StatusCodes} = require("http-status-codes");
const User = require("../models/User");
const {BadRequestError, authError} = require("../error");
// const jwt = require("jsonwebtoken");


const register = async (req, res, next) => {
    const {name, email, password} = req.body;
    // if(!name || !email || !password){
    //     throw new BadRequestError("Provid name, email and password");
    // }
    // encryption is done using mongoose middleware (in user.js)
    const user = await User.create({...req.body});
    // we will use mongoose instance (document) method for jwt tokens

    res.status(StatusCodes.OK).json({user: {name: user.getName()}, token:user.getJWT()});
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError("Provid both email and password!");
    }
    const user = await User.findOne({email: email});
    if(!user) {
        throw new authError("Invalid credentials!");
    }
    //compare password 
    const correct = await user.comparePass(password);
    if(!correct){
        throw new authError("Invalid credentials!");
    }
    const token = user.getJWT();
    res.status(StatusCodes.OK).json({user:{name: user.getName()}, token: token});
}

module.exports = {register, login}