const {CustomError} = require("../error");
const {StatusCodes} = require("http-status-codes");

const errorHandler = (err, req, res, next) => {

    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : err.message || "Something went wrong!"
    }

    // if(err instanceof CustomError){
    //     return res.status(err.statusCode).json({msg: err.message});
    // }
    if(err.code && err.code == 11000){
        customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} !`;
        customError.statusCode = 400;
        
    }
    if(err.name === "ValidationError"){
        customError.msg = Object.values(err.errors).map((error) => error.message).join(",")
        customError.statusCode = 400;
    }
    if(err.name === "CastError"){
        customError.msg = `No item with id ${err.value}`;
        customError.statusCode = 404;
    }
    // return res.status(customError.statusCode).json({err});
    return res.status(customError.statusCode).json({msg: customError.msg});
}

module.exports = errorHandler;