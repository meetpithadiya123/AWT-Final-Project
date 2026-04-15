import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
    enrollment: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    solution: {
        type: String,
        default: ""
    },
    date: {
        type: String
    }
});

export default mongoose.model("Complaint", ComplaintSchema);