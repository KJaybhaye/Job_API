const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, "company name is required!"],
        maxlength: 40
    },
    position: {
        type: String,
        required: [true, "position name is required!"],
        maxlength: 40
    },
    status: {
        type: String,
        enum: ["pending", "interview", "declined"],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "user is required!"]
    }
}, {timestamps:true})

module.exports = mongoose.model("Job", jobSchema);