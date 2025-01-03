import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['online', 'dnd'],
        default: 'online'
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;