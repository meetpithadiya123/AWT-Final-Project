import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import MakeComplaint from "./pages/MakeComplaint";
import ViewComplaints from "./pages/ViewComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageUsers from "./pages/AdminManageUsers";
import AdminManageHOD from "./pages/AdminManageHOD";
import AdminViewComplaints from "./pages/AdminViewComplaints";
import HODDashboard from "./pages/HODDashboard";
import HODViewComplaints from "./pages/HODViewComplaints";

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    
                    {/* User Routes */}
                    <Route path="/user/:enrollment" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
                    <Route path="/user/:enrollment/make-complaint" element={<ProtectedRoute role="user"><MakeComplaint /></ProtectedRoute>} />
                    <Route path="/user/:enrollment/view-complaints" element={<ProtectedRoute role="user"><ViewComplaints /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/manage-users" element={<ProtectedRoute role="admin"><AdminManageUsers /></ProtectedRoute>} />
                    <Route path="/admin/manage-hod" element={<ProtectedRoute role="admin"><AdminManageHOD /></ProtectedRoute>} />
                    <Route path="/admin/view-complaints" element={<ProtectedRoute role="admin"><AdminViewComplaints /></ProtectedRoute>} />

                    {/* HOD Routes */}
                    <Route path="/hod" element={<ProtectedRoute role="hod"><HODDashboard /></ProtectedRoute>} />
                    <Route path="/hod/view-complaints" element={<ProtectedRoute role="hod"><HODViewComplaints /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
