const mongoose = require("mongoose");


const connectDB = (url) => {
    mongoose.set('strictQuery', false);//depratcation warning
    return mongoose.connect(url);
}

module.exports = connectDB;
