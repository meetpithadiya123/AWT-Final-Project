import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children, title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const isAdmin = user?.role === "admin";
    const isHOD = user?.role === "hod";
    const isUser = user?.role === "user";

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <div className="sidebar">
                <h2>{isAdmin ? "Admin Panel" : isHOD ? "HOD Panel" : "User Panel"}</h2>
                
                {isUser && (
                    <>
                        <Link to={`/user/${user.enrollment}`} className={location.pathname === `/user/${user.enrollment}` ? 'active' : ''}>
                            <i className="fas fa-desktop"></i> Dashboard
                        </Link>
                        <Link to={`/user/${user.enrollment}/make-complaint`} className={location.pathname === `/user/${user.enrollment}/make-complaint` ? 'active' : ''}>
                            <i className="fas fa-plus-circle"></i> Create Complaint
                        </Link>
                        <Link to={`/user/${user.enrollment}/view-complaints`} className={location.pathname === `/user/${user.enrollment}/view-complaints` ? 'active' : ''}>
                            <i className="fas fa-list-alt"></i> My History
                        </Link>
                    </>
                )}

                {isAdmin && (
                    <>
                        <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                        </Link>
                        <Link to="/admin/manage-users" className={location.pathname === '/admin/manage-users' ? 'active' : ''}>
                            <i className="fas fa-users-cog"></i> Users Management
                        </Link>
                        <Link to="/admin/manage-hod" className={location.pathname === '/admin/manage-hod' ? 'active' : ''}>
                            <i className="fas fa-user-shield"></i> HOD Management
                        </Link>
                        <Link to="/admin/view-complaints" className={location.pathname === '/admin/view-complaints' ? 'active' : ''}>
                            <i className="fas fa-clipboard-list"></i> All Complaints
                        </Link>
                    </>
                )}

                {isHOD && (
                    <>
                        <Link to="/hod" className={location.pathname === '/hod' ? 'active' : ''}>
                            <i className="fas fa-columns"></i> HOD Dashboard
                        </Link>
                        <Link to="/hod/view-complaints" className={location.pathname === '/hod/view-complaints' ? 'active' : ''}>
                            <i className="fas fa-tasks"></i> Pending Tasks
                        </Link>
                    </>
                )}

                <a onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>

            {/* Main Area */}
            <div className="main">
                <div className="header">
                    <h3>{title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span>Welcome, {user?.enrollment}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
