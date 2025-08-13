import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: String,
        enum: ['client', "freelancer"],
        required: true,
    }
},{timestamps: true})

export const User = mongoose.model('Users', userSchema)