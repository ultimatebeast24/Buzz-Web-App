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
    // isAdmin: {
    //     type: Boolean,
    //     default: false,
    // },
    
},//createdAT , updatedAT => member since -> <createdAt>
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;