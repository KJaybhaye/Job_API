const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is empty!"],
        minLength: 2,
        maxLenght: 40
    },
    email:{
        type: String,
        required: [true, "email is empty!"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password:{
        type: String,
        required: [true, "password is empty!"],
        minLength: 5,
    }
})

// note use function keyword and not arrow function, so that the "this" will point to the 
// document (instance)
userSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.getName = function(){
    return this.name;
}

userSchema.methods.getJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.SECRET_KEY, {expiresIn:process.env.JWT_LIFE});
}

userSchema.methods.comparePass = async function(password){
    const matched = await bcrypt.compare(password, this.password);
    return matched;
}
module.exports = mongoose.model("User",userSchema);
