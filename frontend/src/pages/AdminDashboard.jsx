import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalHOD: 0, totalComplaints: 0, pendingComplaints: 0 });
    const [recent, setRecent] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/admin/dashboard");
            setStats(res.data);
            setRecent(res.data.recentComplaints);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout title="Admin Dashboard">
            <div className="stats">
                <div className="stat-card total">
                    <i className="fas fa-users" style={{ color: '#3498db' }}></i>
                    <h2>{stats.totalUsers}</h2>
                    <p>Total Users</p>
                </div>
                <div className="stat-card solved">
                    <i className="fas fa-user-tie" style={{ color: '#2ecc71' }}></i>
                    <h2>{stats.totalHOD}</h2>
                    <p>Total HOD</p>
                </div>
                <div className="stat-card processing">
                    <i className="fas fa-file-alt" style={{ color: '#f39c12' }}></i>
                    <h2>{stats.totalComplaints}</h2>
                    <p>Total Complaints</p>
                </div>
                <div className="stat-card pending">
                    <i className="fas fa-exclamation-circle" style={{ color: '#e74c3c' }}></i>
                    <h2>{stats.pendingComplaints}</h2>
                    <p>Pending Complaints</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <Link to="/admin/manage-users" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', background: '#667eea', color: 'white' }}>
                    <i className="fas fa-users-cog"></i>
                    <h3>Manage Users</h3>
                </Link>
                <Link to="/admin/manage-hod" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', background: '#2c3e50', color: 'white' }}>
                    <i className="fas fa-user-shield"></i>
                    <h3>Manage HOD</h3>
                </Link>
                <Link to="/admin/view-complaints" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', background: '#27ae60', color: 'white' }}>
                    <i className="fas fa-clipboard-list"></i>
                    <h3>View All Complaints</h3>
                </Link>
            </div>

            <div className="glass-card" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                <h3>Recent Complaints</h3>
                <table style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recent.map(c => (
                            <tr key={c._id}>
                                <td>{c.enrollment}</td>
                                <td>{c.title}</td>
                                <td>{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
