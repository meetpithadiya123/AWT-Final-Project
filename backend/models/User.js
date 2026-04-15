import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    enrollment: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "hod", "user"],
        default: "user"
    }
});

const User = mongoose.model("User", UserSchema);
export default User;