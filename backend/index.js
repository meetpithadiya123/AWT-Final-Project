import express from "express";
import mongoose from "mongoose";
import Complaint from "./models/Complaint_data.js";
import User from "./models/User.js";
import session from "express-session";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ==========================
   MIDDLEWARE
========================== */
app.use(cors({
    origin: "https://awt-final-project-frontend.vercel.app",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "complaint_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

/* ==========================
   SERVER
========================== */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("AWT Backend API is Running!");
});



function isAdmin(req, res, next) {
    if (!req.session.userId || req.session.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
}

function isHOD(req, res, next) {
    if (!req.session.userId || req.session.role !== "hod") {
        return res.status(403).json({ message: "Access denied. HOD only." });
    }
    next();
}

function isUser(req, res, next) {
    if (!req.session.userId || req.session.role !== "user") {
        return res.status(403).json({ message: "Access denied. User only." });
    }
    next();
}

/* ==========================
   DATABASE CONNECTION
========================== */
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("✅ Database Connected");
        await createDefaultUsers();
    })
    .catch(err => console.log(err));

/* ==========================
   CREATE DEFAULT ADMIN & HOD
========================== */
const createDefaultUsers = async () => {

    const admin = await User.findOne({ enrollment: "8888" });

    if (!admin) {
        const hashedPassword = await bcrypt.hash("admin", 10);

        await User.create({
            name: "Admin",
            enrollment: "8888",
            email: "admin@college.com",
            department: "Administration",
            password: hashedPassword,
            role: "admin"
        });
    }

    const hod = await User.findOne({ enrollment: "9999" });

    if (!hod) {
        const hashedPassword = await bcrypt.hash("HOD", 10);

        await User.create({
            name: "HOD",
            enrollment: "9999",
            email: "hod@college.com",
            department: "Computer",
            password: hashedPassword,
            role: "hod"
        });
    }

    console.log("Default Admin & HOD Ready");
};

/* ==========================
   AUTH ROUTES
========================== */
app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ authenticated: false });
    }
    const user = await User.findById(req.session.userId).select("-password");
    res.json({ authenticated: true, user });
});

app.post("/api/login", async (req, res) => {
    const { enrollment, password } = req.body;
    let user = await User.findOne({ enrollment });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            enrollment,
            password: hashedPassword,
            role: "user"
        });
        console.log("New user created:", enrollment);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Enrollment or Password" });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.enrollment = user.enrollment;

    res.json({
        message: "Login successful",
        user: {
            id: user._id,
            role: user.role,
            enrollment: user.enrollment
        }
    });
});

/* ==========================
   USER ROUTES
========================== */

// Dashboard
app.get("/api/user/dashboard/:enrollment", isUser, async (req, res) => {
    if (req.session.enrollment !== req.params.enrollment) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const enrollment = req.params.enrollment;
    const total = await Complaint.countDocuments({ enrollment });
    const processing = await Complaint.countDocuments({ enrollment, status: "Processing" });
    const solved = await Complaint.countDocuments({ enrollment, status: "Solved" });

    res.json({
        enrollment,
        total,
        processing,
        solved
    });
});

// Make Complaint Page
// Open Make Complaint Page
// Make Complaint API (removed GET page as React handles UI)
app.post("/api/user/complaint/:enrollment", isUser, async (req, res) => {
    if (req.session.enrollment !== req.params.enrollment) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const { enrollment } = req.params;
    const { title, description, priority, date } = req.body;

    const complaint = await Complaint.create({
        enrollment,
        title,
        description,
        priority,
        date,
        status: "Pending"
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });
});

// View My Complaints
app.get("/api/user/complaints/:enrollment", isUser, async (req, res) => {
    if (req.session.enrollment !== req.params.enrollment) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const { enrollment } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    const total = await Complaint.countDocuments({ enrollment });
    const complaints = await Complaint.find({ enrollment })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
        complaints,
        enrollment,
        currentPage: page,
        totalPages
    });
});

/* ==========================
   ADMIN ROUTES
========================== */

app.get("/api/admin/dashboard", isAdmin, async (req, res) => {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalHOD = await User.countDocuments({ role: "hod" });
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });

    const recentComplaints = await Complaint.find()
        .sort({ _id: -1 })
        .limit(5);

    res.json({
        totalUsers,
        totalHOD,
        totalComplaints,
        pendingComplaints,
        recentComplaints
    });
});



/* ==========================
   ADMIN MANAGE USERS
========================== */
app.get("/api/admin/users", isAdmin, async (req, res) => {
    const users = await User.find({ role: "user" });
    res.json({ users });
});


app.post("/api/admin/delete-user", isAdmin, async (req, res) => {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
});

/* ==========================
   ADMIN MANAGE HOD
========================== */
app.get("/api/admin/hods", isAdmin, async (req, res) => {
    const hods = await User.find({ role: "hod" });
    res.json({ hods });
});

app.post("/api/admin/delete-hod", isAdmin, async (req, res) => {
    const { hodId } = req.body;
    await User.findByIdAndDelete(hodId);
    res.json({ message: "HOD deleted successfully" });
});

app.get("/api/admin/complaints", isAdmin, async (req, res) => {
    const complaints = await Complaint.find().sort({ _id: -1 });
    res.json({ complaints });
});


/* ==========================
   HOD ROUTES
========================== */


app.get("/api/hod/dashboard", isHOD, async (req, res) => {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const processing = await Complaint.countDocuments({ status: "Processing" });
    const solved = await Complaint.countDocuments({ status: "Solved" });

    const recentComplaints = await Complaint.find()
        .sort({ _id: -1 })
        .limit(5);

    res.json({
        total,
        pending,
        processing,
        solved,
        recentComplaints
    });
});

app.get("/api/hod/complaints", isHOD, async (req, res) => {
    const complaints = await Complaint.find().sort({ _id: -1 });
    res.json({ complaints });
});


/* ==========================
   HOD UPDATE COMPLAINT
========================== */

app.post("/api/hod/update-complaint", isHOD, async (req, res) => {
    const { complaintId, status, solution } = req.body;
    await Complaint.findByIdAndUpdate(complaintId, {
        status,
        solution
    });
    res.json({ message: "Complaint updated successfully" });
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
});


app.post("/api/admin/add-user", isAdmin, async (req, res) => {
    const { enrollment, password, role } = req.body;
    const existing = await User.findOne({ enrollment });
    if (existing) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        enrollment,
        password: hashedPassword,
        role
    });
    res.status(201).json({ message: "User created successfully", user: newUser });
});

export default app;
